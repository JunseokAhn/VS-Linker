// TypeScript Import 테스트

import { User, UserRole } from './types';
import { validateUser, createUser } from './helper';

const adminUser: User = createUser('admin', 'admin@test.com', UserRole.Admin);
const regularUser: User = createUser('user', 'user@test.com', UserRole.User);

console.log('Admin user valid:', validateUser(adminUser));
console.log('Regular user valid:', validateUser(regularUser));
