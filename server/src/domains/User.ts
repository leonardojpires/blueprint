import bcrypt from 'bcrypt';
import { ShowUserDTO } from '../dtos/ShowUserDTO.js';

export class User {
    public id?: number | undefined;
    public name: string;
    public email: string;
    private passwordHash: string;
    public is_admin: boolean;
    public created_at: Date;
    public updated_at: Date;

    constructor(
        id: number | undefined,
        name: string,
        email: string,
        passwordHash: string,
        is_admin: boolean,
        created_at: Date,
        updated_at: Date
    ) {
        this.id = id || undefined;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.is_admin = is_admin;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public async checkPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.passwordHash);
    }

    public get getPassword(): string {
        return this.passwordHash;
    }

    public toSafeObject(): ShowUserDTO {
        const { id, name, email, is_admin } = this;
        return { id, name, email, is_admin };
    }
}
