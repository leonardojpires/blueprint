import { IUserRepository } from "../users/user.repository.interface.js";
import { User } from "../users/user.entity.js";
import bcrypt from 'bcrypt';
import { buildToken } from "./auth.token.js";
import { Response } from "express";

export class AuthService {
    constructor(private userRepository: IUserRepository) {}

    async register(name: string, email: string, password: string) {
        if (!name || !email || !password) throw new Error("Invalid input.");
        if (!email.includes("@")) throw new Error("Invalid email.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) throw new Error('This e-mail has already been taken.');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(undefined, name, email, hashedPassword, false, new Date(), new Date());

        await this.userRepository.save(newUser);

        const createdUser = await this.userRepository.findByEmail(email);
        if (!createdUser) throw new Error('User not created.');
        if (!createdUser.id) throw new Error('User not created.');

        const token = buildToken(createdUser.id, false);

        return {
            success: true,
            user: newUser,
            token
        }
    }

    async login(email: string, password: string, rememberMe: boolean) {
        if (!email || !password) throw new Error("Invalid input.");
        if (!email.includes("@")) throw new Error("Invalid email.");

        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("This user does not exist.");
        if (!user.id) throw new Error("This user does not exist.");

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) throw new Error("Invalid password.");

        const token = buildToken(user.id, rememberMe);

        return {
            success: true,
            user,
            token
        }
    }

    async logout(res: Response) {
        const cookieName = process.env.COOKIE_NAME || "auth_token";
        res.clearCookie(cookieName, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        });
    }
}
