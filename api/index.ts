import type { Request, Response } from "express";
import app from "../src/app.js";
import { seedSuperAdmin } from "../src/app/utils/seed.js";
import { redisService } from "../src/app/lib/redis.js";

// Runs once per cold start (module scope persists across warm invocations
// of the same serverless instance), not on every request.
let readyPromise: Promise<void> | null = null;

const ensureReady = () => {
    if (!readyPromise) {
        readyPromise = (async () => {
            await seedSuperAdmin().catch((error) => console.error("seedSuperAdmin failed:", error));
            await redisService.connect().catch((error) => console.error("Redis connect failed:", error));
        })();
    }

    return readyPromise;
};

export default async function handler(req: Request, res: Response) {
    await ensureReady();
    return app(req, res);
}
