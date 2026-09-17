import jwt from "jsonwebtoken";
import { CookieOptions } from "express";
import { randomUUID } from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET || "";
// const COOKIE_NAME = process.env.COOKIE_NAME || "";

function buildToken(userId: number, rememberMe: boolean) {
    console.log(rememberMe);
    return jwt.sign(
        { sub: userId },
        JWT_SECRET,
        { expiresIn: rememberMe ? "30d" : "1d", jwtid: randomUUID() }
    );
}

function buildCookieOptions(): CookieOptions {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 60 * 60 * 24 * 7 * 1000,
    };
}

export { buildToken, buildCookieOptions };
