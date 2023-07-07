import { IResponseToClient } from "src/configs/response-to-client.config";
import { NftService } from "src/modules/nft/nft.service";
import { CreateNewNftTypeDto } from "src/modules/nft/dto/create-new-nft-type.dto";
import { RegisterNftDto } from "src/modules/nft/dto/register-nft.dto";
import { MintNftDto } from "src/modules/nft/dto/mint-nft.dto";
import { AssociateTokenDto } from "src/modules/nft/dto/associate-token.dto";
import { ListNftTypeDto } from "src/modules/nft/dto/list-nft-type.dto";
import { ListNftDto } from "src/modules/nft/dto/list-nft.dto";
import { SetNftPropertyDto } from "src/modules/nft/dto/set-nft-property.dto";
export declare class NftController {
    private readonly nftService;
    constructor(nftService: NftService);
    createNewNFTType(request: any, createNewNftTypeDto: CreateNewNftTypeDto): Promise<IResponseToClient>;
    getNftTypes(request: any, listNftTypeDto: ListNftTypeDto): Promise<IResponseToClient>;
    getNfts(request: any, listNftDto: ListNftDto): Promise<IResponseToClient>;
    registerNftTypeToSmartContract(request: any, registerNftDto: RegisterNftDto): Promise<IResponseToClient>;
    mintNFT(request: any, mintNftDto: MintNftDto): Promise<IResponseToClient>;
    setNftProperty(request: any, setNftPropertyDto: SetNftPropertyDto): Promise<IResponseToClient>;
    associateToken(request: any, associateTokenDto: AssociateTokenDto): Promise<IResponseToClient>;
    uploadFile(request: any, file: Express.Multer.File): Promise<IResponseToClient>;
}
