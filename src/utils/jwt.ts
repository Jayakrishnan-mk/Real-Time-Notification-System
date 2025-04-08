import { sign, verify, Secret, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as Secret;

export const signToken = (
    payload: string | object | Buffer,
    expiresIn: '7d' | '1h' | number = '7d'
): string => {
    return sign(payload, JWT_SECRET, { expiresIn });
};


export const verifyToken = (token: string): JwtPayload | string => {
    return verify(token, JWT_SECRET);
};
