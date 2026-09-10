import { Request, Response } from "express";
import { AuthService } from "../services/authService.js";
import { buildCookieOptions } from "../jwt/jwt_build.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token";

const cookieOptions = buildCookieOptions();

export class AuthController {
    constructor(private authService: AuthService) {}

    register = async (req: Request, res: Response) => { 
        try {
            const { name, email, password } = req.body;
            const result = await this.authService.register(name, email, password);

            res.cookie(COOKIE_NAME, result.token, cookieOptions);

            return res.status(201).json({
                success: result.success,
                user: result.user.toSafeObject()
            });
        } catch(error: unknown) {
            // console.error("Account registration failed:", error);
            return res.status(400).json({
                message: "We couldn't create your account. Please check your details and try again."
            });
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password, rememberMe } = req.body;
            const result = await this.authService.login(email, password, rememberMe);

            res.cookie(COOKIE_NAME, result.token, cookieOptions);

            return res.status(200).json({
                success: result.success,
                user: result.user.toSafeObject()
            });
        } catch(error: unknown) {
            // console.error("Login failed:", error);
            return res.status(401).json({
                message: "The e-mail or password is incorrect."
            });
        }
    }

    logout = async (_req: Request, res: Response) => {
        try {
            await this.authService.logout(res);
            
            res.clearCookie(COOKIE_NAME);

            return res.status(200).json({
                message: "Logged out successfully.", 
                success: true 
            });
        } catch(error: unknown) {
            // console.error("Logout failed:", error);
            return res.status(500).json({
                message: "We couldn't log you out. Please try again."
            });
        }
    }
}
