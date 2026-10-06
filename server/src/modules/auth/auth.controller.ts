import { sendProblem } from "../../shared/http/problem.js";
import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { buildCookieOptions } from "./auth.token.js";
import { toShowUserDTO } from "../users/user.mapper.js";

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
                data: toShowUserDTO(result.user)
            });
        } catch(error: unknown) {
            // console.error("Account registration failed:", error);
            return sendProblem(res, 400, "INVALID_REQUEST", "We couldn't create your account. Please check your details and try again.");
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password, rememberMe } = req.body;
            const result = await this.authService.login(email, password, rememberMe);

            res.cookie(COOKIE_NAME, result.token, cookieOptions);

            return res.status(200).json({
                data: toShowUserDTO(result.user)
            });
        } catch(error: unknown) {
            // console.error("Login failed:", error);
            return sendProblem(res, 401, "AUTHENTICATION_REQUIRED", "The e-mail or password is incorrect.");
        }
    }

    logout = async (_req: Request, res: Response) => {
        try {
            await this.authService.logout(res);
            
            res.clearCookie(COOKIE_NAME);

            return res.status(204).end();
        } catch(error: unknown) {
            // console.error("Logout failed:", error);
            return sendProblem(res, 500, "INTERNAL_ERROR", "We couldn't log you out. Please try again.");
        }
    }
}
