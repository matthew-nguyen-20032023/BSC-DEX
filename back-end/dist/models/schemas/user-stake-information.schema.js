"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStakeInformationSchema = exports.UserStakeInformationStatus = exports.UserStakeInformation = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("@nestjs/mongoose");
const create_update_schema_1 = require("./create-update.schema");
let UserStakeInformation = class UserStakeInformation extends create_update_schema_1.CreateUpdateSchema {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], UserStakeInformation.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], UserStakeInformation.prototype, "stakeType", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], UserStakeInformation.prototype, "nftId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Number)
], UserStakeInformation.prototype, "endTime", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], UserStakeInformation.prototype, "status", void 0);
UserStakeInformation = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ collection: "user_stake_information" })
], UserStakeInformation);
exports.UserStakeInformation = UserStakeInformation;
var UserStakeInformationStatus;
(function (UserStakeInformationStatus) {
    UserStakeInformationStatus["Staking"] = "staking";
    UserStakeInformationStatus["Completed"] = "completed";
    UserStakeInformationStatus["Penalty"] = "penalty";
    UserStakeInformationStatus["FailedToComplete"] = "failed_to_complete";
})(UserStakeInformationStatus = exports.UserStakeInformationStatus || (exports.UserStakeInformationStatus = {}));
exports.UserStakeInformationSchema = mongoose_1.SchemaFactory.createForClass(UserStakeInformation);
//# sourceMappingURL=user-stake-information.schema.js.map