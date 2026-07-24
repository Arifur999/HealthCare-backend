import { NextFunction, Request, Response } from "express";
import { redisService } from "../lib/redis.js";

interface RateLimitOptions {
    // A short label that namespaces the counter (e.g. "login", "register").
    scope: string;
    // Time window in seconds.
    windowSeconds: number;
    // Maximum allowed requests per IP within the window.
    max: number;
    // Message returned when the limit is exceeded.
    message?: string;
}

// Best-effort client IP: behind Vercel/other proxies the real client is in
// x-forwarded-for; fall back to Express's req.ip / socket address locally.
const getClientIp = (req: Request): string => {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length > 0) {
        return forwarded.split(",")[0]!.trim();
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
        return forwarded[0]!;
    }
    return req.ip || req.socket.remoteAddress || "unknown";
};

// A Redis-backed fixed-window rate limiter. It intentionally fails OPEN: if
// Redis is unavailable we allow the request rather than lock everyone out.
export const rateLimit = ({ scope, windowSeconds, max, message }: RateLimitOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = getClientIp(req);
        const key = `ratelimit:${scope}:${ip}`;

        const count = await redisService.incrementWithExpiry(key, windowSeconds);

        // null => Redis unavailable: don't block.
        if (count !== null && count > max) {
            res.setHeader("Retry-After", String(windowSeconds));
            return res.status(429).json({
                success: false,
                message: message ?? "Too many requests. Please try again later.",
            });
        }

        next();
    };
};

// Sensible defaults for authentication endpoints (brute-force protection).
export const authRateLimiter = rateLimit({
    scope: "auth",
    windowSeconds: 15 * 60,
    max: 20,
    message: "Too many attempts. Please wait a few minutes and try again.",
});

// Throttles public form submissions (e.g. doctor applications) to curb spam.
export const publicSubmitRateLimiter = rateLimit({
    scope: "public-submit",
    windowSeconds: 60 * 60,
    max: 5,
    message: "You've submitted too many times recently. Please try again later.",
});
