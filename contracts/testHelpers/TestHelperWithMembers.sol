// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "../WithMembers.sol";

/// @title A helper contract for testing WithMembers contract
/// @author Jarl Nieuwenhuijzen
/// @dev The WithMember contract contains only internal functions
contract TestHelperWithMembers is WithMembers {
    function addMember(address _newMember) public {
        _addMember(_newMember);
    }

    function removeMember(address _member) public {
        _removeMember(_member);
    }

    function setQuorumPercentage(uint256 _percentage) public {
        _setQuorumPercentage(_percentage);
    }

    function quorumReached(address[] memory _quorumMembers)
        public
        view
        returns (bool)
    {
        return _quorumReached(_quorumMembers);
    }
}
