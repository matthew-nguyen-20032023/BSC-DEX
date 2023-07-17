// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // await hre.tenderly.persistArtifacts({
  //   name: "ZeroEx",
  //   address: "0x51Bfa0FCebd9a9F72b0523aa37968794F3C214a7",
  // });
  // return;

  const zeroEx = await hre.ethers.deployContract("ZeroEx", [
    "0x594Ab22De186eBad2f4c0FD4F3D224599BEc3Cac",
  ]);
  const zeroExDeployed = await zeroEx.waitForDeployment();
  const zeroAddress = await zeroExDeployed.getAddress();

  const weth = await hre.ethers.deployContract("WETH9");
  const wethDeployed = await weth.waitForDeployment();
  const wethAddress = await wethDeployed.getAddress();

  const staking = await hre.ethers.deployContract("Staking", [wethAddress]);
  const stakingDeployed = await staking.waitForDeployment();
  const stakingAddress = await stakingDeployed.getAddress();

  const birdToken = await hre.ethers.deployContract("ERC20TokenCreation", [
    100000000000,
    "Bird",
    "B",
  ]);
  const birdTokenDeployed = await birdToken.waitForDeployment();
  const birdAddress = await birdTokenDeployed.getAddress();

  const tigerToken = await hre.ethers.deployContract("ERC20TokenCreation", [
    100000000000,
    "Bird",
    "B",
  ]);
  const tigerTokenDeployed = await tigerToken.waitForDeployment();
  const tigerAddress = await tigerTokenDeployed.getAddress();

  const feeCollectorController = await hre.ethers.deployContract(
    "FeeCollectorController",
    [wethAddress, stakingAddress]
  );
  const feeCollectorControllerDeployed =
    await feeCollectorController.waitForDeployment();
  const feeCollectorControllerAddress =
    await feeCollectorControllerDeployed.getAddress();

  const NativeOrdersFeature = await hre.ethers.deployContract(
    "NativeOrdersFeature",
    [zeroAddress, wethAddress, stakingAddress, feeCollectorControllerAddress, 0]
  );
  const NativeOrdersFeatureDeployed =
    await NativeOrdersFeature.waitForDeployment();
  const NativeOrdersFeatureAddress =
    await NativeOrdersFeatureDeployed.getAddress();

  console.log(zeroAddress, "zeroAddress");
  console.log(wethAddress, "wethAddress");
  console.log(stakingAddress, "stakingAddress");
  console.log(birdAddress, "birdAddress");
  console.log(tigerAddress, "tigerAddress");
  console.log(feeCollectorControllerAddress, "feeCollectorControllerAddress");
  console.log(NativeOrdersFeatureAddress, "NativeOrdersFeatureAddress");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
