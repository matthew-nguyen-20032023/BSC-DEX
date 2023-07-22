const hre = require("hardhat");

/**
 * @description: Deploy smart contract and get contract address
 * @param contractName: string
 * @param constructorParams: any[]
 * @returns {Promise<string>}
 */
async function deployContract(contractName, constructorParams) {
  const contractFactory = await hre.ethers.deployContract(
    contractName,
    constructorParams
  );
  const contractDeployed = await contractFactory.waitForDeployment();
  return await contractDeployed.getAddress();
}

async function main() {
  // @description: Uncomment this for provide source code for tenderly to debug transaction error if needed
  // await hre.tenderly.persistArtifacts({
  //   name: "ZeroEx",
  //   address: "0x51Bfa0FCebd9a9F72b0523aa37968794F3C214a7",
  // });
  // return;

  const zeroAddress = await deployContract("ZeroEx", [
    process.env.ADMIN_WALLET_ADDRESS,
  ]);
  const wethAddress = await deployContract("WETH9", []);
  const stakingAddress = await deployContract("Staking", [wethAddress]);
  const erc20USDTAddress = await deployContract("ERC20TokenCreation", [
    100000000000,
    "Dollar",
    "USDT",
  ]);
  const erc20EURAddress = await deployContract("ERC20TokenCreation", [
    100000000000,
    "Euro",
    "EUR",
  ]);
  const feeCollectorControllerAddress = await deployContract(
    "FeeCollectorController",
    [wethAddress, stakingAddress]
  );
  const NativeOrdersFeatureAddress = await deployContract(
    "NativeOrdersFeature",
    [zeroAddress, wethAddress, stakingAddress, feeCollectorControllerAddress, 0]
  );

  console.log(
    zeroAddress,
    "== Verify Contract: using in field verifyContract when create limit order"
  );
  console.log(
    wethAddress,
    "== WETH Contract: using for fee custom and another"
  );
  console.log(
    stakingAddress,
    "== Stake Contract: using for stake and get fee reward"
  );
  console.log(
    erc20EURAddress,
    "=== ERU ERC20 Token Contract: using just for testing our own token"
  );
  console.log(
    erc20USDTAddress,
    "=== USDT ERC20 Token Contract: using just for testing our own token"
  );
  console.log(
    feeCollectorControllerAddress,
    "== Fee Contract: using for collect fee when user join for trade"
  );
  console.log(
    NativeOrdersFeatureAddress,
    "== Order Contract: using for create order and fill order for trade ERC20 token"
  );
  console.log(
    "For more information, refer to https://0x.org/ for understand more how to use"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
