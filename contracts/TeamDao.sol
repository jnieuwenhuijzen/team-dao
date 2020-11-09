// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./WithMembers.sol";
import "./VoterToken.sol";

contract TeamDao is WithMembers {
    enum ProposalType {
        setIndividualVotingPower,
        setDefaultVotingPower,
        addMember,
        removeMember,
        vote
    }

    struct Proposal {
        VotingToken token;
        ProposalType proposalType;
        address[] quorum;
        uint256 startTime;
        uint256 endTime;
    }
    Proposal[] proposals;
    uint256 totalProposals;

    mapping(address => uint256) votingPower;
    uint256 defaultVotingPower;

    constructor(uint256 _defaultVotingPower) public {
        _defaultVotingPower = defaultVotingPower;
        votingPower[msg.sender] = defaultVotingPower;
    }

    function _createVote(uint256 pid) internal {
        proposals[pid].votingToken = new VoterToken(
            proposals[pid].name,
            proposals[pid].startTime,
            proposals[pid].endTime
        );
        for (uint256 i = 0; i < members; ++i) {
            proposals[pid].votingToken.mint(
                members[i],
                votingPower[members[i]]
            );
        }
        votingToken.renounceOwnership();
    }
}
