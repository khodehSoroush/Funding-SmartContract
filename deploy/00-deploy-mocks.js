const { network } = require("hardhat");
const {
  developmentChains,
  DECIMALS,
  INITAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  if (developmentChains.includes(network.name)) {
    log("Local network detected ! Deploying mocks... ");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITAL_ANSWER],
    });
    log("Mock Deployed 🥱 !")
    log("-----------------------------------------------")
  }
};

module.exports.tags = ["all",  "mocks"]