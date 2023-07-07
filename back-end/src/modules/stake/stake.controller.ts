import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { StakeService } from "src/modules/stake/stake.service";
import { StakeSuccessMessage } from "src/modules/stake/stake.const";
import { ConfigStakeDto } from "src/modules/stake/dto/config-stake.dto";
import { UserRole } from "src/models/schemas/user.schema";
import { NFTErrorMessage } from "src/modules/nft/nft.const";
import { ListConfigStakeDto } from "src/modules/stake/dto/list-config-stake.dto";
import { Public } from "src/modules/authentication/auth.const";
import { StakeNftDto } from "src/modules/stake/dto/stake-nft.dto";
import { GetNftStakeInformationDto } from "src/modules/stake/dto/get-nft-stake-information.dto";
import { UnStakeNftDto } from "src/modules/stake/dto/un-stake-nft.dto";

@Controller("stake")
@ApiBearerAuth()
@ApiTags("Stake NFT")
export class StakeController {
  constructor(private readonly stakeService: StakeService) {}

  @Post("config")
  @ApiOperation({
    summary: "[Admin] Api for admin to config stake.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: StakeSuccessMessage.ConfigRuleSuccess,
  })
  public async getWallet(
    @Request() request,
    @Body() configStakeDto: ConfigStakeDto
  ): Promise<IResponseToClient> {
    if (request.user.role !== UserRole.Admin) {
      throw new HttpException(
        { message: NFTErrorMessage.PermissionDenied },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const result = await this.stakeService.configStakeRule(configStakeDto);
    return {
      message: StakeSuccessMessage.ConfigRuleSuccess,
      data: result,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get("config")
  @ApiOperation({
    summary: "[Public] Api for get current stake config active.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: StakeSuccessMessage.GetConfigRuleSuccess,
  })
  @Public()
  public async getActiveConfigStake(
    @Query() listConfigStakeDto: ListConfigStakeDto
  ): Promise<IResponseToClient> {
    const result = await this.stakeService.getActiveConfigRule(
      listConfigStakeDto.page,
      listConfigStakeDto.limit
    );
    return {
      message: StakeSuccessMessage.GetConfigRuleSuccess,
      data: result,
      statusCode: HttpStatus.OK,
    };
  }

  @Post("stake-nft")
  @ApiOperation({
    summary: "Api for user to stake their NFT.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: StakeSuccessMessage.StakeNFTSuccess,
  })
  public async stakeNft(
    @Request() request,
    @Body() stakeNftDto: StakeNftDto
  ): Promise<IResponseToClient> {
    const result = await this.stakeService.stakeNft(
      request.user.id,
      stakeNftDto.nftId,
      stakeNftDto.stakeType
    );
    return {
      message: StakeSuccessMessage.StakeNFTSuccess,
      data: result,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get("my-nft-staking")
  @ApiOperation({
    summary: "Api for user to get their NFT staking information.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: StakeSuccessMessage.GetNFTStakeInformationSuccess,
  })
  public async getNftStakeInformation(
    @Request() request,
    @Query() getNftStakeInformationDto: GetNftStakeInformationDto
  ): Promise<IResponseToClient> {
    const result = await this.stakeService.getNftStakeInformation(
      request.user.id,
      getNftStakeInformationDto.page,
      getNftStakeInformationDto.limit
    );
    return {
      message: StakeSuccessMessage.GetNFTStakeInformationSuccess,
      data: result,
      statusCode: HttpStatus.OK,
    };
  }

  @Post("un-stake-nft")
  @ApiOperation({
    summary: "Api for user to un stake their NFT.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: StakeSuccessMessage.UnStakeNFTSuccess,
  })
  public async unStakeNft(
    @Request() request,
    @Body() unStakeNftDto: UnStakeNftDto
  ): Promise<IResponseToClient> {
    const result = await this.stakeService.unStakeNFT(
      request.user.id,
      unStakeNftDto.nftId
    );
    return {
      message: StakeSuccessMessage.UnStakeNFTSuccess,
      data: result,
      statusCode: HttpStatus.OK,
    };
  }
}
