import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { NftService } from "src/modules/nft/nft.service";
import { NFTErrorMessage, NFTSuccessMessage } from "src/modules/nft/nft.const";
import { CreateNewNftTypeDto } from "src/modules/nft/dto/create-new-nft-type.dto";
import { UserRole } from "src/models/schemas/user.schema";
import { RegisterNftDto } from "src/modules/nft/dto/register-nft.dto";
import { MintNftDto } from "src/modules/nft/dto/mint-nft.dto";
import { AssociateTokenDto } from "src/modules/nft/dto/associate-token.dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { pinFileToIPFS } from "src/libs/pinata";
import { ListNftTypeDto } from "src/modules/nft/dto/list-nft-type.dto";
import { ListNftDto } from "src/modules/nft/dto/list-nft.dto";
import { SetNftPropertyDto } from "src/modules/nft/dto/set-nft-property.dto";

@Controller("nft")
@ApiBearerAuth()
@ApiTags("NFT")
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post("create-new-type")
  @ApiOperation({
    summary: "[Admin] Api for admin to create new type of NFT.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: NFTSuccessMessage.CreateNewNFTTypeSuccess,
  })
  public async createNewNFTType(
    @Request() request,
    @Body() createNewNftTypeDto: CreateNewNftTypeDto
  ): Promise<IResponseToClient> {
    if (request.user.role !== UserRole.Admin) {
      throw new HttpException(
        { message: NFTErrorMessage.PermissionDenied },
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const newNftTypeCreated = await this.nftService.createNewNftType(
      createNewNftTypeDto.nftType,
      createNewNftTypeDto.nftName,
      createNewNftTypeDto.nftSymbol,
      createNewNftTypeDto.tier,
      createNewNftTypeDto.defaultBalance
    );
    return {
      message: NFTSuccessMessage.CreateNewNFTTypeSuccess,
      data: newNftTypeCreated,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get("list-nft-type")
  @ApiOperation({
    summary: "Api to get list type of NFT created.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: NFTSuccessMessage.GetNFTTypeSuccess,
  })
  public async getNftTypes(
    @Request() request,
    @Query() listNftTypeDto: ListNftTypeDto
  ): Promise<IResponseToClient> {
    const { types, total } = await this.nftService.getListNftType(
      listNftTypeDto.page,
      listNftTypeDto.limit
    );
    return {
      message: NFTSuccessMessage.GetNFTTypeSuccess,
      data: types,
      statusCode: HttpStatus.OK,
      metadata: {
        total: total,
      },
    };
  }

  @Get("list-nft")
  @ApiOperation({
    summary: "[Admin] Api for admin to get list of NFT created.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: NFTSuccessMessage.GetNFTSuccess,
  })
  public async getNfts(
    @Request() request,
    @Query() listNftDto: ListNftDto
  ): Promise<IResponseToClient> {
    if (request.user.role !== UserRole.Admin) {
      throw new HttpException(
        { message: NFTErrorMessage.PermissionDenied },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const { nfts, total } = await this.nftService.getListNFT(
      listNftDto.page,
      listNftDto.limit
    );
    return {
      message: NFTSuccessMessage.GetNFTSuccess,
      data: nfts,
      statusCode: HttpStatus.OK,
      metadata: {
        total: total,
      },
    };
  }

  @Post("register-nft-smart-contract")
  @ApiOperation({
    summary:
      "[Admin] Api for admin to register nft type for management smart contract.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: NFTSuccessMessage.RegisterNFTSuccess,
  })
  public async registerNftTypeToSmartContract(
    @Request() request,
    @Body() registerNftDto: RegisterNftDto
  ): Promise<IResponseToClient> {
    if (request.user.role !== UserRole.Admin) {
      throw new HttpException(
        { message: NFTErrorMessage.PermissionDenied },
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const result = await this.nftService.registerNftTypeToSmartContract(
      registerNftDto.nftTypeId
    );
    return {
      message: NFTSuccessMessage.RegisterNFTSuccess,
      data: result,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post("mint-NFT")
  @ApiOperation({
    summary: "[Admin] Api to mint NFT for admin. Require associate token",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: NFTSuccessMessage.MintNFTSuccess,
  })
  public async mintNFT(
    @Request() request,
    @Body() mintNftDto: MintNftDto
  ): Promise<IResponseToClient> {
    if (request.user.role !== UserRole.Admin) {
      throw new HttpException(
        { message: NFTErrorMessage.PermissionDenied },
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const nftMined = await this.nftService.mintNFT(
      mintNftDto.nftTypeId,
      mintNftDto.ipfs,
      mintNftDto.receiverEmail,
      mintNftDto.tier,
      mintNftDto.balance,
      mintNftDto.description
    );

    return {
      message: NFTSuccessMessage.MintNFTSuccess,
      data: nftMined,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post("set-NFT-property")
  @ApiOperation({
    summary: "[Admin] Api for admin to set NFT property",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: NFTSuccessMessage.UpdateNFTSuccess,
  })
  public async setNftProperty(
    @Request() request,
    @Body() setNftPropertyDto: SetNftPropertyDto
  ): Promise<IResponseToClient> {
    if (request.user.role !== UserRole.Admin) {
      throw new HttpException(
        { message: NFTErrorMessage.PermissionDenied },
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const nftUpdated = await this.nftService.updateNFT(
      setNftPropertyDto.nftId,
      setNftPropertyDto.ipfs,
      setNftPropertyDto.tier,
      setNftPropertyDto.balance
    );

    return {
      message: NFTSuccessMessage.UpdateNFTSuccess,
      data: nftUpdated,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post("associate-token")
  @ApiOperation({
    summary: "Api to associate token to wallet of account.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: NFTSuccessMessage.AssociateTokenSuccess,
  })
  public async associateToken(
    @Request() request,
    @Body() associateTokenDto: AssociateTokenDto
  ): Promise<IResponseToClient> {
    const result = await this.nftService.associateTokenToAccount(
      request.user.id,
      associateTokenDto.nftTypeId
    );

    return {
      message: NFTSuccessMessage.AssociateTokenSuccess,
      data: result,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post("upload-file")
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Api to pin image NFT to ipfs using pinata" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @Request() request,
    // @ts-ignore
    @UploadedFiles() file: Express.Multer.File
  ): Promise<IResponseToClient> {
    const data = await pinFileToIPFS(file[0]);
    return {
      message: NFTSuccessMessage.PinFileToPinataSuccess,
      data: data,
      statusCode: HttpStatus.CREATED,
    };
  }
}
