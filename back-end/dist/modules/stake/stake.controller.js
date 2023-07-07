"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stake_service_1 = require("./stake.service");
const stake_const_1 = require("./stake.const");
const config_stake_dto_1 = require("./dto/config-stake.dto");
const user_schema_1 = require("../../models/schemas/user.schema");
const nft_const_1 = require("../nft/nft.const");
const list_config_stake_dto_1 = require("./dto/list-config-stake.dto");
const auth_const_1 = require("../authentication/auth.const");
const stake_nft_dto_1 = require("./dto/stake-nft.dto");
const get_nft_stake_information_dto_1 = require("./dto/get-nft-stake-information.dto");
const un_stake_nft_dto_1 = require("./dto/un-stake-nft.dto");
let StakeController = class StakeController {
    constructor(stakeService) {
        this.stakeService = stakeService;
    }
    async getWallet(request, configStakeDto) {
        if (request.user.role !== user_schema_1.UserRole.Admin) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.PermissionDenied }, common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const result = await this.stakeService.configStakeRule(configStakeDto);
        return {
            message: stake_const_1.StakeSuccessMessage.ConfigRuleSuccess,
            data: result,
            statusCode: common_1.HttpStatus.CREATED,
        };
    }
    async getActiveConfigStake(listConfigStakeDto) {
        const result = await this.stakeService.getActiveConfigRule(listConfigStakeDto.page, listConfigStakeDto.limit);
        return {
            message: stake_const_1.StakeSuccessMessage.GetConfigRuleSuccess,
            data: result,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    async stakeNft(request, stakeNftDto) {
        const result = await this.stakeService.stakeNft(request.user.id, stakeNftDto.nftId, stakeNftDto.stakeType);
        return {
            message: stake_const_1.StakeSuccessMessage.StakeNFTSuccess,
            data: result,
            statusCode: common_1.HttpStatus.CREATED,
        };
    }
    async getNftStakeInformation(request, getNftStakeInformationDto) {
        const result = await this.stakeService.getNftStakeInformation(request.user.id, getNftStakeInformationDto.page, getNftStakeInformationDto.limit);
        return {
            message: stake_const_1.StakeSuccessMessage.GetNFTStakeInformationSuccess,
            data: result,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    async unStakeNft(request, unStakeNftDto) {
        const result = await this.stakeService.unStakeNFT(request.user.id, unStakeNftDto.nftId);
        return {
            message: stake_const_1.StakeSuccessMessage.UnStakeNFTSuccess,
            data: result,
            statusCode: common_1.HttpStatus.OK,
        };
    }
};
tslib_1.__decorate([
    (0, common_1.Post)("config"),
    (0, swagger_1.ApiOperation)({
        summary: "[Admin] Api for admin to config stake.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: stake_const_1.StakeSuccessMessage.ConfigRuleSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, config_stake_dto_1.ConfigStakeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], StakeController.prototype, "getWallet", null);
tslib_1.__decorate([
    (0, common_1.Get)("config"),
    (0, swagger_1.ApiOperation)({
        summary: "[Public] Api for get current stake config active.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: stake_const_1.StakeSuccessMessage.GetConfigRuleSuccess,
    }),
    (0, auth_const_1.Public)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [list_config_stake_dto_1.ListConfigStakeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], StakeController.prototype, "getActiveConfigStake", null);
tslib_1.__decorate([
    (0, common_1.Post)("stake-nft"),
    (0, swagger_1.ApiOperation)({
        summary: "Api for user to stake their NFT.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: stake_const_1.StakeSuccessMessage.StakeNFTSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, stake_nft_dto_1.StakeNftDto]),
    tslib_1.__metadata("design:returntype", Promise)
], StakeController.prototype, "stakeNft", null);
tslib_1.__decorate([
    (0, common_1.Get)("my-nft-staking"),
    (0, swagger_1.ApiOperation)({
        summary: "Api for user to get their NFT staking information.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: stake_const_1.StakeSuccessMessage.GetNFTStakeInformationSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, get_nft_stake_information_dto_1.GetNftStakeInformationDto]),
    tslib_1.__metadata("design:returntype", Promise)
], StakeController.prototype, "getNftStakeInformation", null);
tslib_1.__decorate([
    (0, common_1.Post)("un-stake-nft"),
    (0, swagger_1.ApiOperation)({
        summary: "Api for user to un stake their NFT.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: stake_const_1.StakeSuccessMessage.UnStakeNFTSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, un_stake_nft_dto_1.UnStakeNftDto]),
    tslib_1.__metadata("design:returntype", Promise)
], StakeController.prototype, "unStakeNft", null);
StakeController = tslib_1.__decorate([
    (0, common_1.Controller)("stake"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("Stake NFT"),
    tslib_1.__metadata("design:paramtypes", [stake_service_1.StakeService])
], StakeController);
exports.StakeController = StakeController;
//# sourceMappingURL=stake.controller.js.map