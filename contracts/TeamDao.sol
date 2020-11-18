// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./WithMembers.sol";
import "./VotingToken.sol";

contract TeamDao is WithMembers {
    enum ProposalType {
        SetQuorumPercentage,
        AddMember,
        RemoveMember,
        Vote,
        SetIndividualVotingPower,
        SetDefaultVotingPower
    }

    struct Proposal {
        string name;
        VotingToken votingToken;
        ProposalType proposalType;
        address[] quorum;
        uint256 startTime;
        uint256 endTime;
        address payloadAddress;
        uint256 payloadNumber;
        bytes32[] votingOptions;
    }
    mapping(address => Proposal) proposals;

    mapping(address => uint256) votingPower;
    uint256 defaultVotingPower;

    constructor(uint256 _defaultVotingPower) public {
        _defaultVotingPower = defaultVotingPower;
        votingPower[msg.sender] = defaultVotingPower;
    }

    function proposeSetQuorumPercentage(
        string memory name,
        uint256 quorumPercentage
    ) onlyMembers public {
        bytes32[] memory votingOptions;
        _setProposal(
            name,
            ProposalType.SetQuorumPercentage,
            0,
            0,
            address(0),
            quorumPercentage,
            votingOptions
        );
    }

    function proposeAddMember(
        string memory name,
        address newMember
    ) onlyMembers public {
        bytes32[] memory votingOptions;
        _setProposal(
            name,
            ProposalType.AddMember,
            0,
            0,
            newMember,
            0,
            votingOptions
        );
    }

    function proposeRemoveMember(
        string memory name,
        address member
    ) onlyMembers public {
        bytes32[] memory votingOptions;
        _setProposal(
            name,
            ProposalType.RemoveMember,
            0,
            0,
            member,
            0,
            votingOptions
        );
    }

    function proposeVote(
        string memory name,
        uint256 startTime,
        uint256 endTime,
        bytes32[] memory votingOptions
    ) onlyMembers public {
        _setProposal(
            name,
            ProposalType.Vote,
            startTime,
            endTime,
            address(0),
            0,
            votingOptions
        );
    }

    function proposeSetIndividualVotingPower(
        string memory name,
        address member,
        uint256 votingPower
    ) onlyMembers public {
        bytes32[] memory votingOptions;
        _setProposal(
            name,
            ProposalType.SetIndividualVotingPower,
            0,
            0,
            member,
            votingPower,
            votingOptions
        );
    }

    function proposeSetDefaultVotingPower(
        string memory name,
        uint256 defaultVotingPower
    ) onlyMembers public {
        bytes32[] memory votingOptions;
        _setProposal(
            name,
            ProposalType.SetDefaultVotingPower,
            0,
            0,
            address(0),
            defaultVotingPower,
            votingOptions
        );
    }

    function _setProposal(
        string memory _name,
        ProposalType _proposalType,
        uint256 _startTime,
        uint256 _endTime,
        address _payloadAddress,
        uint256 _payloadNumber,
        bytes32[] memory _votingOptions
    ) internal {
        require(proposals[msg.sender].quorum.length == 0, 'Cannot overwrite proposal!');
        address[] storage initialQuorum;
        VotingToken initialVotingToken;
        proposals[msg.sender] = Proposal({
            name: _name,
            proposalType: _proposalType,
            quorum: initialQuorum,
            startTime: _startTime,
            endTime: _endTime,
            votingToken: initialVotingToken,
            payloadAddress: _payloadAddress,
            payloadNumber: _payloadNumber,
            votingOptions: _votingOptions
        });
        supportProposal(msg.sender);
    }

    function removeProposal() onlyMembers public {
        delete proposals[msg.sender];
    }

    function getProposal(address proposer) public view returns(
        string memory name,
        VotingToken votingToken,
        ProposalType proposalType,
        address[] memory quorum,
        uint256 startTime,
        uint256 endTime,
        address payloadAddress,
        uint256 payloadNumber,
        bytes32[] memory votingOptions
    ) {
        name = proposals[proposer].name;
        votingToken = proposals[proposer].votingToken;
        proposalType = proposals[proposer].proposalType;
        quorum = proposals[proposer].quorum;
        startTime = proposals[proposer].startTime;
        endTime = proposals[proposer].endTime;
        payloadAddress = proposals[proposer].payloadAddress;
        payloadNumber = proposals[proposer].payloadNumber;
        votingOptions = proposals[proposer].votingOptions;
    }

    function supportProposal(address proposer) onlyMembers public {
        proposals[proposer].quorum.push(msg.sender);
        if (_quorumReached(proposals[proposer].quorum)) {
            activateProposal(proposer);
        }
    }

    function activateProposal(address proposer) public {
        require(_quorumReached(proposals[proposer].quorum), "Quorum not reached!");
        if (proposals[proposer].proposalType == ProposalType.SetQuorumPercentage) {
            _setQuorumPercentage(proposals[proposer].payloadNumber);
        } else if (proposals[proposer].proposalType == ProposalType.AddMember) {
            _addMember(proposals[proposer].payloadAddress);
        } else if (proposals[proposer].proposalType == ProposalType.RemoveMember) {
            _removeMember(proposals[proposer].payloadAddress);
        } else if (proposals[proposer].proposalType == ProposalType.Vote) {
            createVote(proposer);
        } else if (proposals[proposer].proposalType == ProposalType.SetIndividualVotingPower) {
            votingPower[(proposals[proposer].payloadAddress)] = proposals[proposer].payloadNumber;
        } else if (proposals[proposer].proposalType == ProposalType.SetDefaultVotingPower) {
            defaultVotingPower = proposals[proposer].payloadNumber;
        }
        delete proposals[proposer];
    }

    function createVote(address proposer) public {
        require(proposals[proposer].quorum.length > 0, "Proposal does not exist!");
        require(proposals[proposer].proposalType == ProposalType.Vote, "Proposal is not a vote!");
        require(_quorumReached(proposals[proposer].quorum), 'No quorum majority reached yet!');
        proposals[proposer].votingToken = new VotingToken(
            proposals[proposer].name,
            proposals[proposer].startTime,
            proposals[proposer].endTime,
            proposals[proposer].votingOptions
        );
        for (uint256 i = 0; i < members.length; ++i) {
            proposals[proposer].votingToken.mint(
                members[i],
                votingPower[members[i]]
            );
        }
        proposals[proposer].votingToken.renounceOwnership();
    }
}
