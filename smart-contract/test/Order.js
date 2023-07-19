const { LimitOrder, SignatureType } = require("@0x/protocol-utils");
const BigNumber = require("bignumber.js");
const { ethers } = require("hardhat");
const {
  RPCSubprovider,
  Web3ProviderEngine,
  PrivateKeyWalletSubprovider,
} = require("@0x/subproviders");
const { providerUtils } = require("@0x/utils");
const { Web3Wrapper } = require("@0x/web3-wrapper");

describe("Exchange Smart Contract", function () {
  async function getProviderEngine() {
    const wallet = new PrivateKeyWalletSubprovider(
      process.env.ACCOUNT_PRIVATE_KEY_1,
      Number(process.env.CHAIN_ID)
    );
    const pe = new Web3ProviderEngine();
    pe.addProvider(wallet);
    pe.addProvider(new RPCSubprovider(process.env.RPC_URL));
    providerUtils.startProviderEngine(pe);
    return pe;
  }

  async function deployContract() {
    const pe = await getProviderEngine();
    const web3Wrapper = new Web3Wrapper(pe);

    const [owner, otherAccount] = await ethers.getSigners();

    const ZeroEx = await ethers.getContractFactory("ZeroEx");
    const ZeroExContract = await ZeroEx.deploy(owner.address);

    const WETH9 = await ethers.getContractFactory("WETH9");
    const WETH9Contract = await WETH9.deploy();

    const Staking = await ethers.getContractFactory("Staking");
    const StakingContract = await Staking.deploy(WETH9Contract.target);

    const BTC = await ethers.getContractFactory("ERC20TokenCreation");
    const BTCContract = await BTC.deploy(100000000000, "Bitcoin", "BTC");

    const USDT = await ethers.getContractFactory("ERC20TokenCreation");
    const USDTContract = await USDT.deploy(100000000000, "Dollar", "USDT");

    const FeeCollectorController = await ethers.getContractFactory(
      "FeeCollectorController"
    );
    const FeeCollectorControllerContract = await FeeCollectorController.deploy(
      WETH9Contract.target,
      StakingContract.target
    );

    const NativeOrdersFeature = await ethers.getContractFactory(
      "NativeOrdersFeature"
    );
    const NativeOrdersFeatureContract = await NativeOrdersFeature.deploy(
      ZeroExContract.target,
      WETH9Contract.target,
      StakingContract.target,
      FeeCollectorControllerContract.target,
      0
    );

    return {
      ZeroExContract,
      WETH9Contract,
      StakingContract,
      BTCContract,
      USDTContract,
      FeeCollectorControllerContract,
      NativeOrdersFeatureContract,
      owner,
      otherAccount,
      web3Wrapper,
    };
  }

  describe("Deployment", function () {
    it("Fill Limit Order", async function () {
      const {
        owner,
        BTCContract,
        USDTContract,
        web3Wrapper,
        NativeOrdersFeatureContract,
        ZeroExContract,
        otherAccount,
      } = await deployContract();

      // For example I want to sell 200 amount of BTC to get 600 amount of USDT
      // From owner account to another account
      const makerAmount = "200"; // This not include decimal, for real you need to times with decimal of token
      const takerAmount = "600"; // This not include decimal, for real you need to times with decimal of token

      // Limit order that will be created off chain and save in Backend
      const limitOrder = new LimitOrder({
        chainId: Number(process.env.CHAIN_ID),
        verifyingContract: ZeroExContract.target,
        maker: owner.address,
        taker: otherAccount.address,
        makerToken: BTCContract.target,
        takerToken: USDTContract.target,
        makerAmount: makerAmount,
        takerAmount: takerAmount,
        takerTokenFeeAmount: new BigNumber(0).toString(),
        sender: "0x0000000000000000000000000000000000000000",
        feeRecipient: "0x0000000000000000000000000000000000000000",
        expiry: Math.floor(Date.now() / 1000 + 300),
        pool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        salt: Date.now().toString(),
      });

      // Signature will save with limit order above and used for other account fill order
      const signature = await limitOrder.getSignatureWithProviderAsync(
        web3Wrapper.getProvider(),
        SignatureType.EIP712,
        owner.address
      );

      // Use owner to mint token for owner and otherAccount for test
      const tokenAmountMintForTest = "100000000000000000000000";
      await BTCContract.mint(owner.address, tokenAmountMintForTest); // Mint BTC for owner
      await USDTContract.mint(otherAccount.address, tokenAmountMintForTest); // Mint USDT for other account

      // Owner approve for smart contract to use BTC of owner
      await BTCContract.approve(
        NativeOrdersFeatureContract.target,
        makerAmount
      );

      let ownerBTCBalance = await BTCContract.balanceOf(owner.address);
      let ownerUSDTBalance = await USDTContract.balanceOf(owner.address);
      let otherAccountBTCBalance = await BTCContract.balanceOf(
        otherAccount.address
      );
      let otherAccountUSDTBalance = await USDTContract.balanceOf(
        otherAccount.address
      );
      console.log("Owner want to sell 200 BTC to get 600 USDT");
      console.log("Balance before trade execution");
      console.log("Owner BTC", ownerBTCBalance);
      console.log("Owner USDT", ownerUSDTBalance);
      console.log("Other Account BTC", otherAccountBTCBalance);
      console.log("Other Account USDT", otherAccountUSDTBalance);
      console.log("==============================================");

      // Other account approve for smart contract to use USDT of other account
      await USDTContract.connect(otherAccount).approve(
        NativeOrdersFeatureContract.target,
        takerAmount
      );

      // Fill order above
      // This is other account accept to take 200 BTC with 600 USDT spent
      await NativeOrdersFeatureContract.connect(otherAccount).fillLimitOrder(
        limitOrder,
        signature,
        takerAmount
      );

      ownerBTCBalance = await BTCContract.balanceOf(owner.address);
      ownerUSDTBalance = await USDTContract.balanceOf(owner.address);
      otherAccountBTCBalance = await BTCContract.balanceOf(
        otherAccount.address
      );
      otherAccountUSDTBalance = await USDTContract.balanceOf(
        otherAccount.address
      );

      console.log("Balance after trade execution");
      console.log("Owner BTC", ownerBTCBalance);
      console.log("Owner USDT", ownerUSDTBalance);
      console.log("Other Account BTC", otherAccountBTCBalance);
      console.log("Other Account USDT", otherAccountUSDTBalance);
      console.log("==============================================");
    });
  });
});
