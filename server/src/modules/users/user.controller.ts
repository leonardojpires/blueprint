import { sendProblem } from "../../shared/http/problem.js";
import type { AuthenticatedRequest } from "../auth/auth.types.js";
import { UserService } from "./user.service.js";
import { toShowUserDTO } from "./user.mapper.js";
import { Request, Response } from 'express';

export class UserController {
    constructor(private userService: UserService) {}

    getAllUsers = async (_req: Request, res: Response) => {
        try {
            const result = await this.userService.getAllUsers();

            const users = result.map(toShowUserDTO);

            return res.status(200).json({
                data: users
            });
        } catch(err: unknown) {
            // console.error("Failed to retrieve users:", err);
            return sendProblem(res, 500, "INTERNAL_ERROR", "We couldn't load the requested information. Please try again.");
        }
    }

    getUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const result = await this.userService.getUserById(Number(id));

            return res.status(200).json({
                data: toShowUserDTO(result)
            });
        } catch(err: unknown) {
            // console.error("Failed to retrieve user:", err);
            return sendProblem(res, 404, "USER_NOT_FOUND", "The requested user could not be found.");
        }
    }

    getCurrentUser = async (req: Request, res: Response) => {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const userId = authenticatedReq.user?.sub;

            if (!userId) {
                return sendProblem(res, 401, "AUTHENTICATION_REQUIRED", "Please sign in to continue.");
            }

            const result = await this.userService.getCurrentUser(Number(userId));

            return res.status(200).json({
                data: toShowUserDTO(result)
            });
        } catch(err: unknown) {
            // console.error("Failed to retrieve current user:", err);
            return sendProblem(res, 500, "INTERNAL_ERROR", "We couldn't load your profile. Please try again.");
        }
    }
}
