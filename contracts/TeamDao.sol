// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./WithMembers.sol";
import "./VoterToken.sol";

contract TeamDao is WithMembers {
  VoterToken public votingToken;

  function _createVote() public {
    string memory name = "Vote_3.1";
    votingToken = new VoterToken(name, block.timestamp, block.timestamp + 1000);
    votingToken.mint(address(msg.sender), 100);
    votingToken.renounceOwnership();
  }
}
