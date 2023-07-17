const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
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
const { ContractWrappers } = require("@0x/contract-wrappers");

describe("Exchange Smart Contract", function () {
  async function deployContract() {
    const wallet = new PrivateKeyWalletSubprovider(
      "0x274aa78ffefcea2a84f444bcff6d360cbdd0610ffe29f444364b49e9d79bf125",
      1337
    );
    const pe = new Web3ProviderEngine();
    pe.addProvider(wallet);
    pe.addProvider(new RPCSubprovider("http://127.0.0.1:7545"));
    providerUtils.startProviderEngine(pe);
    const web3Wrapper = new Web3Wrapper(pe);

    const contractWrappers = new ContractWrappers(pe, { chainId: 1337 });

    const [owner, otherAccount] = await ethers.getSigners();

    const ZeroEx = await ethers.getContractFactory("ZeroEx");
    const ZeroExContract = await ZeroEx.deploy(owner.address);

    const WETH9 = await ethers.getContractFactory("WETH9");
    const WETH9Contract = await WETH9.deploy();

    const Staking = await ethers.getContractFactory("Staking");
    const StakingContract = await Staking.deploy(WETH9Contract.target);

    const Bird = await ethers.getContractFactory("ERC20TokenCreation");
    const BirdContract = await Bird.deploy(100000000000, "Bird", "B");

    const Tiger = await ethers.getContractFactory("ERC20TokenCreation");
    const TigerContract = await Tiger.deploy(100000000000, "Tiger", "T");

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
      BirdContract,
      TigerContract,
      FeeCollectorControllerContract,
      NativeOrdersFeatureContract,
      owner,
      otherAccount,
      web3Wrapper,
      contractWrappers,
    };
  }

  describe("Deployment", function () {
    it("Fill Limit Order", async function () {
      const {
        owner,
        BirdContract,
        TigerContract,
        web3Wrapper,
        NativeOrdersFeatureContract,
        ZeroExContract,
        otherAccount,
      } = await deployContract();

      const limitOrder = new LimitOrder({
        chainId: 1337,
        verifyingContract: ZeroExContract.target,
        maker: owner.address,
        taker: otherAccount.address,
        makerToken: BirdContract.target,
        takerToken: TigerContract.target,
        makerAmount: 1,
        takerAmount: 2,
        takerTokenFeeAmount: new BigNumber(0).toString(),
        sender: "0x0000000000000000000000000000000000000000",
        feeRecipient: "0x0000000000000000000000000000000000000000",
        expiry: Math.floor(Date.now() / 1000 + 300),
        pool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        salt: Date.now().toString(),
      });

      const signature = await limitOrder.getSignatureWithProviderAsync(
        web3Wrapper.getProvider(),
        SignatureType.EIP712,
        owner.address
      );

      await BirdContract.mint(owner.address, "100000000000000000000000");
      await TigerContract.mint(
        otherAccount.address,
        "100000000000000000000000"
      );
      await BirdContract.approve(
        NativeOrdersFeatureContract.target,
        "100000000000000000000000"
      );
      await TigerContract.connect(otherAccount).approve(
        NativeOrdersFeatureContract.target,
        "100000000000000000000000"
      );

      const birdBalance = await BirdContract.balanceOf(owner.address);
      const tigerBalance = await TigerContract.balanceOf(owner.address);
      console.log(birdBalance, "maker bird balance before");
      console.log(tigerBalance, "maker tiger balance before");

      const birdBalanceOther = await BirdContract.balanceOf(
        otherAccount.address
      );
      const tigerBalanceOther = await TigerContract.balanceOf(
        otherAccount.address
      );
      console.log(birdBalanceOther, "taker bird balance before");
      console.log(tigerBalanceOther, "taker tiger balance before");
      console.log("==============================================");
      console.log("==============================================");
      console.log("==============================================");
      console.log("==============================================");

      await NativeOrdersFeatureContract.connect(otherAccount).fillLimitOrder(
        limitOrder,
        signature,
        2
      );

      const birdBalance1 = await BirdContract.balanceOf(owner.address);
      const tigerBalance1 = await TigerContract.balanceOf(owner.address);
      console.log(birdBalance1, "maker bird balance after");
      console.log(tigerBalance1, "maker tiger balance after");

      const birdBalanceOther1 = await BirdContract.balanceOf(
        otherAccount.address
      );
      const tigerBalanceOther1 = await TigerContract.balanceOf(
        otherAccount.address
      );
      console.log(birdBalanceOther1, "taker bird balance after");
      console.log(tigerBalanceOther1, "taker tiger balance after");
    });
  });
});
