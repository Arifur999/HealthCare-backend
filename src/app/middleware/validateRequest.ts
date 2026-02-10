import { NextFunction, Request, Response } from "express";
import z from "zod";

 export const validateRequest=(zodSchema :z.ZodObject) => {
    return (req:Request, res:Response, next:NextFunction) => {
        const parseResult = zodSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parseResult.error.issues,
            });
        }

        req.body = parseResult.data;
        next();
    }
}