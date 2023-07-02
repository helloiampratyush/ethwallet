const { network } = require("hardhat");
const { verify } = require("../utils/verify");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const f1 = await deploy("parentContract", {
    from: deployer,
    log: true,
    args: [],
  });

  log("if it go through then only deploy chid contract");
  log("deploying child contract");
  const f2 = await deploy("childContrat", {
    from: deployer,
    log: true,
    args: [],
  });
  const chainId = network.config.chainId;
  log("deployed checking error");
  if (chainId == "11155111") {
    await verify(f2.address, []);
  }
};
module.exports.tags = ["parent", "all"];
