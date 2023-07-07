import { Controller, Get, HttpStatus, Query, Request } from "@nestjs/common";
import { WalletService } from "src/modules/wallet/wallet.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { WalletSuccessMessage } from "src/modules/wallet/wallet.const";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { NFTSuccessMessage } from "src/modules/nft/nft.const";
import { ListNftDto } from "src/modules/wallet/dto/list-nft.dto";

@Controller("wallet")
@ApiBearerAuth()
@ApiTags("Wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({
    summary: "Api to get wallet.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: WalletSuccessMessage.GetWalletSuccess,
  })
  public async getWallet(@Request() request): Promise<IResponseToClient> {
    const { wallet, balance } = await this.walletService.getUserWallet(
      request.user.id
    );
    return {
      message: WalletSuccessMessage.GetWalletSuccess,
      data: { wallet: wallet, balance: JSON.parse(balance) },
      statusCode: HttpStatus.OK,
    };
  }

  @Get("export-private-key")
  @ApiOperation({
    summary: "Export wallet private key.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: WalletSuccessMessage.ExportWalletPrivateKeySuccess,
  })
  public async exportWalletPrivateKey(
    @Request() request
  ): Promise<IResponseToClient> {
    const privateKey = await this.walletService.exportWalletPrivateKey(
      request.user.id
    );
    return {
      message: WalletSuccessMessage.ExportWalletPrivateKeySuccess,
      data: privateKey,
      statusCode: HttpStatus.OK,
    };
  }

  @Get("my-nft")
  @ApiOperation({
    summary: "Api to get list NFT belong to account.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: NFTSuccessMessage.GetMyNFTSuccess,
  })
  public async getMyNft(
    @Request() request,
    @Query() listNftDto: ListNftDto
  ): Promise<IResponseToClient> {
    const result = await this.walletService.listNft(
      request.user.id,
      listNftDto.nftTypes,
      listNftDto.page,
      listNftDto.limit
    );

    return {
      message: NFTSuccessMessage.GetMyNFTSuccess,
      data: result.nfts,
      statusCode: HttpStatus.OK,
      metadata: {
        total: result.total,
      },
    };
  }

  @Get("mint-HBAR")
  @ApiOperation({
    summary: "Api to mint HBAR.",
  })
  public async mintHBAR(@Request() request): Promise<IResponseToClient> {
    await this.walletService.mintHBAR(request.user.id);

    return {
      message: "ok",
      data: true,
      statusCode: HttpStatus.OK,
    };
  }
}
