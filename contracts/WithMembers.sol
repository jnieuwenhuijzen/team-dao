// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./openzeppelin/SafeMath.sol";

/// @title A contract for managing members and quorum majority
/// @author Jarl Nieuwenhuijzen
/// @notice This contract should be used in conjunction with team-dao
/// @dev inherit this contract
/// @dev to implement: Maintain array list of membersgi
contract WithMembers {
    mapping(address => bool) public members;
    uint256 public totalMembers;
    uint256 public quorumPercentage = 60;

    /// @notice Check if the msg.sender is a member
    modifier onlyMembers {
        require(members[msg.sender], "Members: caller is not member");
        _;
    }

    /// @notice The creator of the contract automatically becomes the first member
    constructor() public {
      members[msg.sender] = true;
      totalMembers = 1;
    }

    /// @notice Add a member to the existing member pool
    /// @param newMember the address of the new member
    function _addMember(address newMember) internal {
        require(!members[newMember]);
        members[newMember] = true;
        totalMembers = SafeMath.add(totalMembers, 1);
    }

    /// @notice Remove a member from the existing member pool
    /// @param member the address of the member to be removed
    function _removeMember(address member) internal {
        require(members[member]);
        members[member] = false;
        totalMembers = SafeMath.sub(totalMembers, 1);
    }

    /// @notice To change the quorumPercentage (default set to 60%)
    /// @param percentage the new quorumPercentage
    function _setQuorumPercentage(uint256 percentage) internal {
        require(
            percentage >= 0 && percentage <= 100,
            "Percentage should be between 0 and 100!"
        );
        quorumPercentage = percentage;
    }

    /// @notice To check if an array of members reaches quorum
    /// @param quorumMembers the pool of quorum members to be checked
    /// @dev note that non-existent members are ignored in determining the pool size
    function _quorumReached(address[] memory quorumMembers)
        internal
        view
        returns (bool)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < quorumMembers.length; i = SafeMath.add(i, 1)) {
            if (members[quorumMembers[i]]) {
                count = SafeMath.add(count, 1);
            }
        }
        return (SafeMath.mul(count, 100) >=
            SafeMath.mul(totalMembers, quorumPercentage));
    }
}
