import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../modules/users/user.repository.js";

const userRepository = new UserRepository();

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.sub;
    if (!userId)
      return res.status(401).json({
        message: "Unauthorized.",
      });

    const user = await userRepository.findById(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
      });

    if (!user.is_admin)
      return res.status(403).json({
        message: "Forbidden.",
      });
    next();
  } catch (err: unknown) {
    return res.status(403).json({
      message: "Forbidden. Invalid or expired token."
    });
  }
};

export default verifyAdmin;
