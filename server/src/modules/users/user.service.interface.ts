import { User } from "./user.entity.js";

export interface IUserService {
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User>;
    getCurrentUser(id: number): Promise<User>;
}
