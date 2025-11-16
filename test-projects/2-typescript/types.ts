// Type definitions

export enum UserRole {
    Admin = 'admin',
    User = 'user',
    Guest = 'guest'
}

export interface User {
    username: string;
    email: string;
    role: UserRole;
}
