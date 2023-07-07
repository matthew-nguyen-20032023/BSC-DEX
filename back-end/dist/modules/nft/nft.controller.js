"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nft_service_1 = require("./nft.service");
const nft_const_1 = require("./nft.const");
const create_new_nft_type_dto_1 = require("./dto/create-new-nft-type.dto");
const user_schema_1 = require("../../models/schemas/user.schema");
const register_nft_dto_1 = require("./dto/register-nft.dto");
const mint_nft_dto_1 = require("./dto/mint-nft.dto");
const associate_token_dto_1 = require("./dto/associate-token.dto");
const platform_express_1 = require("@nestjs/platform-express");
const pinata_1 = require("../../libs/pinata");
const list_nft_type_dto_1 = require("./dto/list-nft-type.dto");
const list_nft_dto_1 = require("./dto/list-nft.dto");
const set_nft_property_dto_1 = require("./dto/set-nft-property.dto");
let NftController = class NftController {
    constructor(nftService) {
        this.nftService = nftService;
    }
    async createNewNFTType(request, createNewNftTypeDto) {
        if (request.user.role !== user_schema_1.UserRole.Admin) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.PermissionDenied }, common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const newNftTypeCreated = await this.nftService.createNewNftType(createNewNftTypeDto.nftType, createNewNftTypeDto.nftName, createNewNftTypeDto.nftSymbol, createNewNftTypeDto.tier, createNewNftTypeDto.defaultBalance);
        return {
            message: nft_const_1.NFTSuccessMessage.CreateNewNFTTypeSuccess,
            data: newNftTypeCreated,
            statusCode: common_1.HttpStatus.CREATED,
        };
    }
    async getNftTypes(request, listNftTypeDto) {
        const { types, total } = await this.nftService.getListNftType(listNftTypeDto.page, listNftTypeDto.limit);
        return {
            message: nft_const_1.NFTSuccessMessage.GetNFTTypeSuccess,
            data: types,
            statusCode: common_1.HttpStatus.OK,
            metadata: {
                total: total,
            },
        };
    }
    async getNfts(request, listNftDto) {
        if (request.user.role !== user_schema_1.UserRole.Admin) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.PermissionDenied }, common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const { nfts, total } = await this.nftService.getListNFT(listNftDto.page, listNftDto.limit);
        return {
            message: nft_const_1.NFTSuccessMessage.GetNFTSuccess,
            data: nfts,
            statusCode: common_1.HttpStatus.OK,
            metadata: {
                total: total,
            },
        };
    }
    async registerNftTypeToSmartContract(request, registerNftDto) {
        if (request.user.role !== user_schema_1.UserRole.Admin) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.PermissionDenied }, common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const result = await this.nftService.registerNftTypeToSmartContract(registerNftDto.nftTypeId);
        return {
            message: nft_const_1.NFTSuccessMessage.RegisterNFTSuccess,
            data: result,
            statusCode: common_1.HttpStatus.CREATED,
        };
    }
    async mintNFT(request, mintNftDto) {
        if (request.user.role !== user_schema_1.UserRole.Admin) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.PermissionDenied }, common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const nftMined = await this.nftService.mintNFT(mintNftDto.nftTypeId, mintNftDto.ipfs, mintNftDto.receiverEmail, mintNftDto.tier, mintNftDto.balance, mintNftDto.description);
        return {
            message: nft_const_1.NFTSuccessMessage.MintNFTSuccess,
            data: nftMined,
            statusCode: common_1.HttpStatus.CREATED,
        };
    }
    async setNftProperty(request, setNftPropertyDto) {
        if (request.user.role !== user_schema_1.UserRole.Admin) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.PermissionDenied }, common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const nftUpdated = await this.nftService.updateNFT(setNftPropertyDto.nftId, setNftPropertyDto.ipfs, setNftPropertyDto.tier, setNftPropertyDto.balance);
        return {
            message: nft_const_1.NFTSuccessMessage.UpdateNFTSuccess,
            data: nftUpdated,
            statusCode: common_1.HttpStatus.CREATED,
        };
    }
    async associateToken(request, associateTokenDto) {
        const result = await this.nftService.associateTokenToAccount(request.user.id, associateTokenDto.nftTypeId);
        return {
            message: nft_const_1.NFTSuccessMessage.AssociateTokenSuccess,
            data: result,
            statusCode: common_1.HttpStatus.CREATED,
        };
    }
    async uploadFile(request, file) {
        const data = await (0, pinata_1.pinFileToIPFS)(file[0]);
        return {
            message: nft_const_1.NFTSuccessMessage.PinFileToPinataSuccess,
            data: data,
            statusCode: common_1.HttpStatus.CREATED,
        };
    }
};
tslib_1.__decorate([
    (0, common_1.Post)("create-new-type"),
    (0, swagger_1.ApiOperation)({
        summary: "[Admin] Api for admin to create new type of NFT.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: nft_const_1.NFTSuccessMessage.CreateNewNFTTypeSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, create_new_nft_type_dto_1.CreateNewNftTypeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], NftController.prototype, "createNewNFTType", null);
tslib_1.__decorate([
    (0, common_1.Get)("list-nft-type"),
    (0, swagger_1.ApiOperation)({
        summary: "Api to get list type of NFT created.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: nft_const_1.NFTSuccessMessage.GetNFTTypeSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, list_nft_type_dto_1.ListNftTypeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], NftController.prototype, "getNftTypes", null);
tslib_1.__decorate([
    (0, common_1.Get)("list-nft"),
    (0, swagger_1.ApiOperation)({
        summary: "[Admin] Api for admin to get list of NFT created.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: nft_const_1.NFTSuccessMessage.GetNFTSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, list_nft_dto_1.ListNftDto]),
    tslib_1.__metadata("design:returntype", Promise)
], NftController.prototype, "getNfts", null);
tslib_1.__decorate([
    (0, common_1.Post)("register-nft-smart-contract"),
    (0, swagger_1.ApiOperation)({
        summary: "[Admin] Api for admin to register nft type for management smart contract.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: nft_const_1.NFTSuccessMessage.RegisterNFTSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, register_nft_dto_1.RegisterNftDto]),
    tslib_1.__metadata("design:returntype", Promise)
], NftController.prototype, "registerNftTypeToSmartContract", null);
tslib_1.__decorate([
    (0, common_1.Post)("mint-NFT"),
    (0, swagger_1.ApiOperation)({
        summary: "[Admin] Api to mint NFT for admin. Require associate token",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: nft_const_1.NFTSuccessMessage.MintNFTSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, mint_nft_dto_1.MintNftDto]),
    tslib_1.__metadata("design:returntype", Promise)
], NftController.prototype, "mintNFT", null);
tslib_1.__decorate([
    (0, common_1.Post)("set-NFT-property"),
    (0, swagger_1.ApiOperation)({
        summary: "[Admin] Api for admin to set NFT property",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: nft_const_1.NFTSuccessMessage.UpdateNFTSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, set_nft_property_dto_1.SetNftPropertyDto]),
    tslib_1.__metadata("design:returntype", Promise)
], NftController.prototype, "setNftProperty", null);
tslib_1.__decorate([
    (0, common_1.Post)("associate-token"),
    (0, swagger_1.ApiOperation)({
        summary: "Api to associate token to wallet of account.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: nft_const_1.NFTSuccessMessage.AssociateTokenSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, associate_token_dto_1.AssociateTokenDto]),
    tslib_1.__metadata("design:returntype", Promise)
], NftController.prototype, "associateToken", null);
tslib_1.__decorate([
    (0, common_1.Post)("upload-file"),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOperation)({ summary: "Api to pin image NFT to ipfs using pinata" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.UploadedFiles)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NftController.prototype, "uploadFile", null);
NftController = tslib_1.__decorate([
    (0, common_1.Controller)("nft"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("NFT"),
    tslib_1.__metadata("design:paramtypes", [nft_service_1.NftService])
], NftController);
exports.NftController = NftController;
//# sourceMappingURL=nft.controller.js.map