import { Router } from "express";
import { UserRepository } from './user.repository.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import authenticateToken from "../../middleware/auth.middleware.js";
import verifyAdmin from "../../middleware/admin.middleware.js";

const userRouter = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.get("/users/me", authenticateToken, userController.getCurrentUser);
userRouter.get("/users", authenticateToken, verifyAdmin, userController.getAllUsers);
userRouter.get("/users/:id", authenticateToken, verifyAdmin, userController.getUserById);

export default userRouter;
