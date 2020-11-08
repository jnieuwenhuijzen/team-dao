// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./openzeppelin/Ownable.sol";
import "./openzeppelin/SafeMath.sol";

/// @title A contract for managing members and quorum majority
/// @author Jarl Nieuwenhuijzen
/// @notice This contract should be used in conjunction with team-dao
/// @dev inherit this contract
contract Members is Ownable {
    mapping(address => bool) public members;
    uint256 public totalMembers = 0;
    uint256 public quorumPercentage = 60;

    /// @notice Check if the msg.sender is a member
    modifier onlyMember {
        require(members[msg.sender], "Members: caller is not member");
        _;
    }

    /// @notice Add a member to the existing member pool
    /// @param _newMember the address of the new member
    function addMember(address _newMember) public onlyOwner {
        require(!members[_newMember]);
        members[_newMember] = true;
        totalMembers = SafeMath.add(totalMembers, 1);
    }

    /// @notice Remove a member from the existing member pool
    /// @param _member the address of the member to be removed
    function removeMember(address _member) public onlyOwner {
        require(members[_member]);
        members[_member] = false;
        totalMembers = SafeMath.sub(totalMembers, 1);
    }

    /// @notice To change the quorumPercentage (default set to 60%)
    /// @param _percentage the new quorumPercentage
    function setQuorumPercentage(uint256 _percentage) public onlyOwner {
        require(
            _percentage >= 0 && _percentage <= 100,
            "Percentage should be between 0 and 100!"
        );
        quorumPercentage = _percentage;
    }

    /// @notice To check if an array of members reaches quorum
    /// @param _quorumMembers the pool of quorum members to be checked
    /// @dev note that non-existent members are ignored in determining the pool size
    function quorumReached(address[] memory _quorumMembers)
        public
        view
        returns (bool)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < _quorumMembers.length; i = SafeMath.add(i, 1)) {
            if (members[_quorumMembers[i]]) {
                count = SafeMath.add(count, 1);
            }
        }
        return (SafeMath.mul(count, 100) >=
            SafeMath.mul(totalMembers, quorumPercentage));
    }
}
