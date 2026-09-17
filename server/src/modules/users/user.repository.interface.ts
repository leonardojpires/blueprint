import { User } from "./user.entity.js";

export interface IUserRepository {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;

    save(user: User): Promise<void>;
}
