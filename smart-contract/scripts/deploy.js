const hre = require("hardhat");
const { AbiEncoder } = require("@0x/utils");
const contractsDeployed = [];
/**
 * @description: Deploy smart contract and get contract address
 * @param contractName: string
 * @param constructorParams: any[]
 * @returns {Promise<{address: string, contract: Contract}>}
 */
async function deployContract(contractName, constructorParams) {
  const contractFactory = await hre.ethers.deployContract(
    contractName,
    constructorParams
  );
  const contractDeployed = await contractFactory.waitForDeployment();
  const address = await contractDeployed.getAddress();

  contractsDeployed.push({
    name:
      contractName === "ERC20TokenCreation"
        ? constructorParams[1]
        : contractName,
    address: address,
  });
  return {
    contract: contractDeployed,
    address: address,
  };
}

async function main() {
  // @description: Uncomment this for provide source code for tenderly to debug transaction error if needed
  // await hre.tenderly.persistArtifacts({
  //   name: "ZeroEx",
  //   address: "0x51Bfa0FCebd9a9F72b0523aa37968794F3C214a7",
  // });
  // return;

  const SimpleFunctionRegistryFeature = await deployContract(
    "SimpleFunctionRegistryFeature",
    []
  );
  const OwnableFeature = await deployContract("OwnableFeature", []);
  const TransformERC20Feature = await deployContract(
    "TransformERC20Feature",
    []
  );
  const FullMigration = await deployContract("FullMigration", [
    process.env.ADMIN_WALLET_ADDRESS,
  ]);
  const bootstrapper = await FullMigration.contract.getBootstrapper();
  const ZeroEx = await deployContract("ZeroEx", [bootstrapper]);
  const MetaTransactionsFeatureContract = await deployContract(
    "MetaTransactionsFeature",
    [ZeroEx.address]
  );

  const BatchFillNativeOrdersFeature = await deployContract(
    "BatchFillNativeOrdersFeature",
    [ZeroEx.address]
  );
  const BatchFillNativeOrdersFeatureSelector = AbiEncoder.createMethod(
    "migrate()",
    []
  ).getSelector();

  const WETH9 = await deployContract("WETH9", []);
  const OtcOrdersFeatureContract = await deployContract("OtcOrdersFeature", [
    ZeroEx.address,
    WETH9.address,
  ]);
  const Staking = await deployContract("Staking", [WETH9.address]);
  const ERC20BitcoinContract = await deployContract("ERC20TokenCreation", [
    100000000000,
    "Bitcoin",
    "BTC",
  ]);
  const ERC20DollarContract = await deployContract("ERC20TokenCreation", [
    100000000000,
    "Dollar",
    "USD",
  ]);
  const FeeCollectorController = await deployContract(
    "FeeCollectorController",
    [WETH9.address, Staking.address]
  );
  const NativeOrdersFeature = await deployContract("NativeOrdersFeature", [
    ZeroEx.address,
    WETH9.address,
    Staking.address,
    FeeCollectorController.address,
    0,
  ]);

  /**
   * @description migrate feature to ZeroEx contract
   */
  await FullMigration.contract.migrateZeroEx(
    process.env.ADMIN_WALLET_ADDRESS,
    ZeroEx.address,
    {
      registry: SimpleFunctionRegistryFeature.address,
      ownable: OwnableFeature.address,
      transformERC20: TransformERC20Feature.address,
      metaTransactions: MetaTransactionsFeatureContract.address,
      nativeOrders: NativeOrdersFeature.address,
      otcOrders: OtcOrdersFeatureContract.address,
    },
    {
      transformerDeployer: process.env.ADMIN_WALLET_ADDRESS,
      zeroExAddress: ZeroEx.address,
      protocolFeeMultiplier: 70e3,
    }
  );
  for (const contractDeployed of contractsDeployed) {
    console.log(contractDeployed.address, contractDeployed.name);
  }
  console.log(
    "For more information, refer to https://0x.org/ for understand more how to use"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
