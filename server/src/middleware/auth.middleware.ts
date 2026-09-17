import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.[process.env.COOKIE_NAME || "auth_token"];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized. No token provided.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");
        if (
            typeof decoded === "string" ||
            typeof decoded.sub !== "number" ||
            typeof decoded.jti !== "string"
        ) {
            return res.status(403).json({ message: "Forbidden. Invalid token payload." });
        }
        req.user = { sub: decoded.sub, jti: decoded.jti };
        
        next();
    } catch(err) {
        return res.status(403).json({
            message: "Forbidden. Invalid or expired token.",
        });
    }
}

export default authenticateToken;
