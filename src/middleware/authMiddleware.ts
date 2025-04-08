import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string;
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: false,
            message: 'Unauthorized: Missing token'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            status: false,
            message: 'Unauthorized: Invalid token'
        });
    }
};
