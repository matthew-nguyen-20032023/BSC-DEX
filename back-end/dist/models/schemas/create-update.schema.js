"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUpdateSchema = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("@nestjs/mongoose");
let CreateUpdateSchema = class CreateUpdateSchema {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        default() {
            return new Date();
        },
    }),
    tslib_1.__metadata("design:type", Date)
], CreateUpdateSchema.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        default() {
            return new Date();
        },
    }),
    tslib_1.__metadata("design:type", Date)
], CreateUpdateSchema.prototype, "updatedAt", void 0);
CreateUpdateSchema = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], CreateUpdateSchema);
exports.CreateUpdateSchema = CreateUpdateSchema;
//# sourceMappingURL=create-update.schema.js.map