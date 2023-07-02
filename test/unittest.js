const { getNamedAccounts, ethers, deployments } = require("hardhat");
const { assert, expect } = require("chai");

let f1, deployer, f2, f3;
describe("EtherWallet&inheritance", function () {
  const sendValue = ethers.utils.parseEther("2");
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    f1 = await ethers.getContract("EtherWallet", deployer);
    f2 = await ethers.getContract("parentContract", deployer);
    f3 = await ethers.getContract("childContrat", deployer);
  });
  describe("construtor", function () {
    it("set the correct value of owner", async function () {
      const response = await f1.getOwner();
      assert.equal(response, deployer);
    });
  });
  describe("deposite", function () {
    it("it will match with deploy if send any to the contract", async function () {
      const response = await f1.deposite({ value: sendValue });
      const expectedResponse = await f1.getAmountSent(deployer);
      assert.equal(expectedResponse.toString(), sendValue.toString());
    });
    it("it will emit event when it will require to emit", async function () {
      await expect(f1.deposite({ value: sendValue })).to.emit(f1, "Fund");
    });
  });

  describe("balance", function () {
    it("it will check and give same value of balances if we do not perform any withdraw", async function () {
      const response1 = await f1.deposite({ value: sendValue });
      const response2 = await f1.getbalance();
      assert.equal(response2.toString(), sendValue.toString());
    });
  });
  describe("withdraw", function () {
    const ethValue = 1;
    beforeEach(async function () {
      const transactionReceipt1 = await f1.deposite({ value: sendValue });
    });
    it("it perform checking of withdraw function", async function () {
      const startingDeployerBalance = await f1.provider.getBalance(deployer);
      const startingContractBalance = await f1.provider.getBalance(f1.address);
      const transactionReceipt2 = await f1.withdraw(ethValue);
      const transactionReceipt = await transactionReceipt2.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      const endingDeployerBalance = await f1.provider.getBalance(deployer);
      const endingContractBalance = await f1.provider.getBalance(f1.address);
      console.log(gasCost.toString());
      const amt2 = await f1.getbalance();
      assert.equal((amt2 / 1e18).toString(), "1");
      assert.equal(
        endingDeployerBalance
          .add(gasCost.add(endingContractBalance))
          .toString(),
        startingDeployerBalance.add(startingContractBalance).toString()
      );
    });
    it("only allow owner to withdraw it", async function () {
      const accounts = await ethers.getSigners();
      const walletConnectedAccounts = await f1.connect(accounts[1]);
      await expect(
        walletConnectedAccounts.withdraw(ethValue)
      ).to.be.revertedWith("only owner is allowed");
    });
    it("reverted error if we try to withdrraw more money than available", async function () {
      const increasedEthValue = ethValue + 2;
      await expect(f1.withdraw(increasedEthValue)).to.be.revertedWith(
        "transaction Failed"
      );
    });
  });
  describe("inheritance", function () {
    it("it will verify  if inheritance is working perfectly", async function () {
      const expectedResponse = await f3.getSum(3, 4);
      assert.equal(expectedResponse.toString(), "7");
    });
  });
});
