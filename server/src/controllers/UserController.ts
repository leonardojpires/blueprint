import { UserService } from "../services/userService.js";
import { Request, Response } from 'express';

type AuthenticatedRequest = Request & { user?: { sub?: number } };

export class UserController {
    constructor(private userService: UserService) {}

    getAllUsers = async (_req: Request, res: Response) => {
        try {
            const result = await this.userService.getAllUsers();

            const users = result.map(user => user.toSafeObject());

            return res.status(200).json({
                success: true,
                users
            });
        } catch(err: unknown) {
            // console.error("Failed to retrieve users:", err);
            return res.status(500).json({
                message: "We couldn't load the requested information. Please try again."
            });
        }
    }

    getUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const result = await this.userService.getUserById(Number(id));

            return res.status(200).json({
                success: true,
                user: result.toSafeObject()
            });
        } catch(err: unknown) {
            // console.error("Failed to retrieve user:", err);
            return res.status(404).json({
                message: "The requested user could not be found."
            });
        }
    }

    getCurrentUser = async (req: Request, res: Response) => {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const userId = authenticatedReq.user?.sub;

            if (!userId) {
                return res.status(401).json({
                    message: "Please sign in to continue."
                });
            }

            const result = await this.userService.getCurrentUser(Number(userId));

            return res.status(200).json({
                success: true,
                user: result.toSafeObject()
            });
        } catch(err: unknown) {
            // console.error("Failed to retrieve current user:", err);
            return res.status(500).json({
                message: "We couldn't load your profile. Please try again."
            });
        }
    }
}
