const { network } = require("hardhat");
const { verify } = require("../utils/verify");
let f1;
console.log("deploying your wallet");
module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  f1 = await deploy("EtherWallet", {
    from: deployer,
    log: true,
    args: [],
  });

  const chainId = network.config.chainId;
  if (chainId == "11155111") {
    log("time to verify your contract");
    log("verifying! PLEASE WAIT");

    await verify(f1.address, []);
    log("verification done");
  }
};
module.exports.tags = ["all", "Wallet"];
