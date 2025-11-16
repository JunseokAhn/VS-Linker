"use strict";
// TypeScript Import 테스트
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const helper_1 = require("./helper");
const adminUser = (0, helper_1.createUser)('admin', 'admin@test.com', types_1.UserRole.Admin);
const regularUser = (0, helper_1.createUser)('user', 'user@test.com', types_1.UserRole.User);
console.log('Admin user valid:', (0, helper_1.validateUser)(adminUser));
console.log('Regular user valid:', (0, helper_1.validateUser)(regularUser));
//# sourceMappingURL=index.js.map