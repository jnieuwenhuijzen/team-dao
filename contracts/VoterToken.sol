// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./openzeppelin/ERC20Burnable.sol";
import "./openzeppelin/Ownable.sol";

contract VoterToken is ERC20Burnable, Ownable {
  constructor(string memory name) public ERC20(name, "VOTE") {}

  function mint(address account, uint256 amount) public onlyOwner {
    _mint(account, amount);
  }

  // Transfer, TransferFrom, Burn and Mint should be pausable.
}
