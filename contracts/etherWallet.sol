//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract EtherWallet {
  mapping(address => uint256) public amountSent;
  address payable public owner;

  constructor() {
    owner = payable(msg.sender);
  }

  event Fund(address indexed senderAddress, uint256 value);
  modifier onlyOwner() {
    require(msg.sender == owner, "only owner is allowed");
    _;
  }

  function deposite() public payable {
    amountSent[msg.sender] += (msg.value);
    emit Fund(msg.sender, (msg.value));
  }

  function withdraw(uint256 ethValue) public payable onlyOwner {
    require((msg.value) < (address(this)).balance, "insufficient balance");
    (bool success, ) = (msg.sender).call{ value: (ethValue * 1e18) }("");
    require(success, "transaction Failed");
  }

  function getbalance() public view returns (uint256) {
    return (address(this)).balance;
  }

  function getOwner() public view returns (address) {
    return owner;
  }

  function getAmountSent(address fundingAddress) public view returns (uint256) {
    return amountSent[fundingAddress];
  }

  function youramount() public view returns (uint256) {
    return amountSent[msg.sender];
  }
}
