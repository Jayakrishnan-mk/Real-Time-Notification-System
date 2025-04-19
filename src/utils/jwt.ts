import { JWT_SECRET } from '@/config/env';

import { sign, verify, Secret, JwtPayload } from 'jsonwebtoken';

const JWT_KEY = JWT_SECRET as Secret;

export const signToken = (
    payload: string | object | Buffer,
    expiresIn: '7d' | '1h' | number = '7d'
): string => {
    return sign(payload, JWT_KEY, { expiresIn });
};


export const verifyToken = (token: string): JwtPayload | string => {
    return verify(token, JWT_KEY);
};
