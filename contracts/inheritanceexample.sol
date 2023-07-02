//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract parentContract {
  function sum(int a, int b) public pure returns (int) {
    return a + b;
  }
}

contract childContrat is parentContract {
  function getSum(int a, int b) public pure returns (int) {
    return sum(a, b);
  }
}
