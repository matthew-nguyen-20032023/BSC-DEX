import { WalletService } from "src/modules/wallet/wallet.service";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { ListNftDto } from "src/modules/wallet/dto/list-nft.dto";
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWallet(request: any): Promise<IResponseToClient>;
    exportWalletPrivateKey(request: any): Promise<IResponseToClient>;
    getMyNft(request: any, listNftDto: ListNftDto): Promise<IResponseToClient>;
    mintHBAR(request: any): Promise<IResponseToClient>;
}
