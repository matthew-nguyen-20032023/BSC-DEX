"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeErrorMessage = exports.StakeSuccessMessage = void 0;
var StakeSuccessMessage;
(function (StakeSuccessMessage) {
    StakeSuccessMessage["ConfigRuleSuccess"] = "Config stake rule success";
    StakeSuccessMessage["GetConfigRuleSuccess"] = "Get config stake rule success";
    StakeSuccessMessage["StakeNFTSuccess"] = "Stake NFT success";
    StakeSuccessMessage["UnStakeNFTSuccess"] = "Un Stake NFT success";
    StakeSuccessMessage["GetNFTStakeInformationSuccess"] = "Get NFT stake information success";
})(StakeSuccessMessage = exports.StakeSuccessMessage || (exports.StakeSuccessMessage = {}));
var StakeErrorMessage;
(function (StakeErrorMessage) {
    StakeErrorMessage["CurrentNftStaking"] = "The current NFT still staking";
    StakeErrorMessage["ConfigStakeRuleNotActive"] = "The stake type not active";
    StakeErrorMessage["InvalidNftForStake"] = "Invalid NFT or the NFT not belong to current user";
    StakeErrorMessage["InvalidNftForUnStake"] = "Invalid NFT or NFT not stake or the NFT not belong to current user";
})(StakeErrorMessage = exports.StakeErrorMessage || (exports.StakeErrorMessage = {}));
//# sourceMappingURL=stake.const.js.map