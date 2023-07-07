export declare enum StakeSuccessMessage {
    ConfigRuleSuccess = "Config stake rule success",
    GetConfigRuleSuccess = "Get config stake rule success",
    StakeNFTSuccess = "Stake NFT success",
    UnStakeNFTSuccess = "Un Stake NFT success",
    GetNFTStakeInformationSuccess = "Get NFT stake information success"
}
export declare enum StakeErrorMessage {
    CurrentNftStaking = "The current NFT still staking",
    ConfigStakeRuleNotActive = "The stake type not active",
    InvalidNftForStake = "Invalid NFT or the NFT not belong to current user",
    InvalidNftForUnStake = "Invalid NFT or NFT not stake or the NFT not belong to current user"
}
