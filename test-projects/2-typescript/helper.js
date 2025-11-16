"use strict";
// Helper functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.createUser = void 0;
function createUser(username, email, role) {
    return {
        username,
        email,
        role
    };
}
exports.createUser = createUser;
function validateUser(user) {
    return user.username.length > 0 && user.email.includes('@');
}
exports.validateUser = validateUser;
//# sourceMappingURL=helper.js.map