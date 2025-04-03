import { plainToInstance } from "class-transformer";
import { validate as classValidatorValidate } from "class-validator"; // 🔹 Rename here
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
    (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }
        next();
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
