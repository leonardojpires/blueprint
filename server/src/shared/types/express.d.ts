import "express";

declare global {
    namespace Express {
        interface UserPayload {
            sub: number;
            jti: string;
        }

        interface Request {
            user?: UserPayload
        }
    }
}
