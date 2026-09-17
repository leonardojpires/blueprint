import type { ShowUserDTO } from './user.dto.js';
import type { User } from './user.entity.js';

export function toShowUserDTO(user: User): ShowUserDTO {
    const { id, name, email, is_admin } = user;
    return { id, name, email, is_admin };
}
