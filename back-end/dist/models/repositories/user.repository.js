"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor(model) {
        this.model = model;
    }
    async save(user) {
        const newUser = new this.model(user);
        return this.model.create(newUser);
    }
    async getUserByEmail(email) {
        return this.model.findOne({ email: email });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map