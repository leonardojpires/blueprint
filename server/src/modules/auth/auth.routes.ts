import { Router } from "express";
import { UserRepository } from "../users/user.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import authenticateToken from "../../middleware/auth.middleware.js";
import { loginLimiter, loginIpLimiter, registerLimiter } from './auth.limiter.js';
import { doubleCsrfProtection, generateCsrfTokenHandler } from "../../middleware/csrf.middleware.js";

const authRouter = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

authRouter.post("/register", registerLimiter, authController.register);
authRouter.post("/login", loginLimiter, loginIpLimiter, authController.login);
authRouter.post("/logout", authenticateToken, doubleCsrfProtection, authController.logout);
authRouter.get("/get-csrf-token", authenticateToken, generateCsrfTokenHandler);

export default authRouter;
