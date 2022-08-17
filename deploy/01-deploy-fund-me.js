// function deployFunc() {
//   console.log("Hello Everyone 👋");
// }

// module.exports.default = deployFunc;

// module.exports = async (hre) => {
//   const { getNamedAccounts, deployments } = hre;

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

// const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { network} = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // if chainID is X use address Y
  // if chainId is Z use address A

  // const ethUsdPriceFeedAddress =  networkConfig[chainId]["ethUsdPriceFeed"]

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, //Put pricefeed address
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
  log("------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
