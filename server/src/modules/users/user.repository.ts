import type { UserRow } from "../../shared/types/database.js";
import { pool } from '../../config/database.js';
import { User } from './user.entity.js';
import { IUserRepository } from './user.repository.interface.js';

/* 
    pool is the connection to the database
    ('pool' would be the same as 'db' => db.query<RowDataPacket[]>(...))
*/

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const [users] = await pool.execute<UserRow[]>('SELECT * FROM users WHERE email = ?', [email]);

        const user = users[0];

        if (!user) return null;

        return new User(user.id, user.name, user.email, user.password_hash, user.is_admin, user.created_at, user.updated_at);
    }

    async findById(id: number): Promise<User | null> {
        const [users] = await pool.execute<UserRow[]>('SELECT * FROM users WHERE id = ?', [id]);

        const user = users[0];

        if (!user) return null;

        return new User(user.id, user.name, user.email, user.password_hash, user.is_admin, user.created_at, user.updated_at);
    }

    async findAll(): Promise<User[]> {
        const [users] = await pool.query<UserRow[]>('SELECT * FROM users');

        return users.map(
            (userRow) => new User(userRow.id, userRow.name, userRow.email, userRow.password_hash, userRow.is_admin, userRow.created_at, userRow.updated_at) 
        )
    }

    async getCurrentUser(id: number): Promise<User | null> {
        const [users] = await pool.execute<UserRow[]>('SELECT * FROM users WHERE id = ?', [id]);

        const user = users[0];

        if (!user) return null;

        return new User(user.id, user.name, user.email, user.password_hash, user.is_admin, user.created_at, user.updated_at);

    }

    async save(user: User): Promise<void> {
        if (user.id) {
            await pool.execute('UPDATE users SET name = ?, email = ?, password_hash = ?, is_admin = ? WHERE id = ?', [user.name, user.email, user.getPassword, user.is_admin, user.id]);
        } else {
            await pool.execute('INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)', [user.name, user.email, user.getPassword, user.is_admin]);
        }
    }

}
