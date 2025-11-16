// Helper functions

import { User, UserRole } from './types';

export function createUser(username: string, email: string, role: UserRole): User {
    return {
        username,
        email,
        role
    };
}

export function validateUser(user: User): boolean {
    return user.username.length > 0 && user.email.includes('@');
}
