// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "../WithMembers.sol";

/// @title A helper contract for testing WithMembers contract
/// @author Jarl Nieuwenhuijzen
/// @dev The WithMember contract contains only internal functions
contract TestHelperWithMembers is WithMembers {
    function addMember(address newMember) public {
        _addMember(newMember);
    }

    function removeMember(address member) public {
        _removeMember(member);
    }

    function setQuorumPercentage(uint256 percentage) public {
        _setQuorumPercentage(percentage);
    }

    function quorumReached(address[] memory quorumMembers)
        public
        view
        returns (bool)
    {
        return _quorumReached(quorumMembers);
    }
}
