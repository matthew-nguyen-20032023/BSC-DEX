"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeRuleSchema = exports.StakeRule = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("@nestjs/mongoose");
const create_update_schema_1 = require("./create-update.schema");
let StakeRule = class StakeRule extends create_update_schema_1.CreateUpdateSchema {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], StakeRule.prototype, "stakeType", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Number)
], StakeRule.prototype, "duration", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Number)
], StakeRule.prototype, "rewardBalance", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Number)
], StakeRule.prototype, "penaltyBalance", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Boolean)
], StakeRule.prototype, "isActive", void 0);
StakeRule = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ collection: "stake_rule" })
], StakeRule);
exports.StakeRule = StakeRule;
exports.StakeRuleSchema = mongoose_1.SchemaFactory.createForClass(StakeRule);
//# sourceMappingURL=stake-rule.schema.js.map