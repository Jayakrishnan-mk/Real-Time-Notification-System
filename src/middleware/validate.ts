import { plainToInstance } from "class-transformer";
import { validate as classValidatorValidate } from "class-validator"; // 🔹 Rename here
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
    (schema: ZodSchema<any>, source: "body" | "query" | "params" = "body") =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                // Use dynamic source (body/query/params)
                schema.parse(req[source]);
                next();
            } catch (error) {
                console.error("❌ Zod validation error:", error);
                return res.status(400).json({ error });
            }
        };


export const validateDTO = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToInstance(dtoClass, req.body);
        const errors = await classValidatorValidate(dtoInstance); // 🔹 Use renamed function

        if (errors.length > 0) {
            return res.status(400).json({
                error: "Validation failed",
                details: errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }))
            });
        }

        req.body = dtoInstance;
        next();
    };
};
