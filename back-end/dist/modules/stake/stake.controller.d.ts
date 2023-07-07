import { IResponseToClient } from "src/configs/response-to-client.config";
import { StakeService } from "src/modules/stake/stake.service";
import { ConfigStakeDto } from "src/modules/stake/dto/config-stake.dto";
import { ListConfigStakeDto } from "src/modules/stake/dto/list-config-stake.dto";
import { StakeNftDto } from "src/modules/stake/dto/stake-nft.dto";
import { GetNftStakeInformationDto } from "src/modules/stake/dto/get-nft-stake-information.dto";
import { UnStakeNftDto } from "src/modules/stake/dto/un-stake-nft.dto";
export declare class StakeController {
    private readonly stakeService;
    constructor(stakeService: StakeService);
    getWallet(request: any, configStakeDto: ConfigStakeDto): Promise<IResponseToClient>;
    getActiveConfigStake(listConfigStakeDto: ListConfigStakeDto): Promise<IResponseToClient>;
    stakeNft(request: any, stakeNftDto: StakeNftDto): Promise<IResponseToClient>;
    getNftStakeInformation(request: any, getNftStakeInformationDto: GetNftStakeInformationDto): Promise<IResponseToClient>;
    unStakeNft(request: any, unStakeNftDto: UnStakeNftDto): Promise<IResponseToClient>;
}
