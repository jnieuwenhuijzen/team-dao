// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./WithMembers.sol";
import "./VotingToken.sol";

contract TeamDao is WithMembers {
    enum ProposalType {
        SetIndividualVotingPower,
        SetDefaultVotingPower,
        AddMember,
        RemoveMember,
        Vote
    }

    struct Proposal {
        string name;
        VotingToken token;
        ProposalType proposalType;
        address[] quorum;
        uint256 startTime;
        uint256 endTime;
    }
    mapping(address => Proposal) proposals;

    mapping(address => uint256) votingPower;
    uint256 defaultVotingPower;

    constructor(uint256 _defaultVotingPower) public {
        _defaultVotingPower = defaultVotingPower;
        votingPower[msg.sender] = defaultVotingPower;
    }

    function setProposal(
        string memory _name,
        ProposalType _proposalType,
        uint256 _startTime,
        uint256 _endTime
    ) onlyMembers public {
        require(proposals[msg.sender].quorum.length == 0, 'Cannot overwrite proposal!');
        address[] storage initialQuorum;
        initialQuorum.push(msg.sender);
        VotingToken initialVotingToken;
        proposals[msg.sender] = Proposal({
            name: _name,
            token: initialVotingToken,
            proposalType: _proposalType,
            quorum: initialQuorum,
            startTime: _startTime,
            endTime: _endTime
        });
    }

    function removeProposal() onlyMembers public {
        delete proposals[msg.sender];
    }

    function getProposal(address proposer) public view returns(
        string memory,
        VotingToken,
        ProposalType,
        address[] memory,
        uint256,
        uint256
    ) {
        return (
            proposals[proposer].name,
            proposals[proposer].token,
            proposals[proposer].proposalType,
            proposals[proposer].quorum,
            proposals[proposer].startTime,
            proposals[proposer].endTime
        );
    }

    function createVote(address proposer) public {
        // require(proposer <= this.totalProposals(), "Proposal does not exist!");
        require(proposals[proposer].proposalType == ProposalType.Vote, "Proposal is not a vote!");
        require(_quorumReached(proposals[proposer].quorum), 'No quorum majority reached yet!');
        proposals[proposer].token = new VotingToken(
            proposals[proposer].name,
            proposals[proposer].startTime,
            proposals[proposer].endTime
        );
        for (uint256 i = 0; i < members.length; ++i) {
            proposals[proposer].token.mint(
                members[i],
                votingPower[members[i]]
            );
        }
        proposals[proposer].token.renounceOwnership();
    }
}
