// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./openzeppelin/SafeMath.sol";

/// @title A contract for managing members and quorum majority
/// @author Jarl Nieuwenhuijzen
/// @notice This contract should be used in conjunction with team-dao
/// @dev inherit this contract
/// @dev to implement: Maintain array list of membersgi
contract WithMembers {
    mapping(address => uint256) memberIndex;
    address[] public members;
    uint256 public quorumPercentage = 60;

    /// @notice Check if the msg.sender is a member
    modifier onlyMembers {
        require(isMember(msg.sender), "Members: caller is not member");
        _;
    }

    /// @notice The creator of the contract automatically becomes the first member
    constructor() public {
        members.push(msg.sender);
        memberIndex[msg.sender] = members.length;
    }

    /// @notice return true if address is member
    /// @param id the address to check
    function isMember(address id) public view returns (bool) {
        return memberIndex[id] > 0;
    }

    /// @notice total number of members
    function totalMembers() public view returns (uint256) {
        return members.length;
    }

    /// @notice Add a member to the existing member pool
    /// @param newMember the address of the new member
    function _addMember(address newMember) internal {
        require(memberIndex[newMember] == 0, "Cannot add duplicate member!");
        members.push(newMember);
        memberIndex[newMember] = members.length;
    }

    /// @notice Remove a member from the existing member pool
    /// @param member the address of the member to be removed
    /// @dev First switch the last element in the list with the element to be removed from the list
    function _removeMember(address member) internal {
        require(members.length > 1, "Cannot remove last member");
        uint256 index = memberIndex[member];
        require(index > 0, "Cannot remove someone that is not member");
        if (index < members.length) {
            address lastMember = members[members.length - 1];
            members[index] = lastMember;
            memberIndex[lastMember] = index;
        }
        memberIndex[member] = 0;
        members.pop();
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
        for (uint256 i = 0; i < quorumMembers.length; ++i) {
            if (memberIndex[quorumMembers[i]] > 0) {
                count = SafeMath.add(count, 1);
            }
        }
        return (SafeMath.mul(count, 100) >=
            SafeMath.mul(members.length, quorumPercentage));
    }
}
