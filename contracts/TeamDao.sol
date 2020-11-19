// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./WithMembers.sol";
import "./VotingToken.sol";

/// @title A contract for team governance
/// @author Jarl Nieuwenhuijzen
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

    mapping(address => uint256) public votingPower;
    uint256 public defaultVotingPower;

    /// @notice Construct a new team-dao. Creator becomes the first member, quorum is set to 60%
    /// @param _defaultVotingPower Number of tokens each member gets for each vote is 100 tokens
    constructor(uint256 _defaultVotingPower) public {
        _defaultVotingPower = defaultVotingPower;
        votingPower[msg.sender] = defaultVotingPower;
    }

    /// @notice Propose to change the quorum percentage of support to activate a proposal
    /// @param name An identifier for this proposal
    /// @param quorumPercentage The new proposed quorum percentage
    function proposeSetQuorumPercentage(string memory name, uint256 quorumPercentage) public onlyMembers {
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

    /// @notice Propose to change the quorum percentage of support to activate a proposal
    /// @param name An identifier for this proposal
    /// @param newMember The address of the proposed new member
    function proposeAddMember(string memory name, address newMember) public onlyMembers {
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

    /// @notice Propose to remove a member from the team
    /// @param name An identifier for this proposal
    /// @param member The member proposed to remove
    function proposeRemoveMember(string memory name, address member) public onlyMembers {
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

    /// @notice Propose a vote
    /// @param name An identifier for this proposal
    /// @param startTime unix time when voting begins
    /// @param endTime unix time when voting ends
    /// @param votingOptions The options for which can be voted.
    /// @dev Voting is done using a VotingToken.
    /// @dev Each voting option is mapped to unique address
    /// @dev Ideally each option is an IPFS hash, but it can be a string
    function proposeVote(string memory name, uint256 startTime, uint256 endTime, bytes32[] memory votingOptions) public onlyMembers {
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

    /// @notice Propose to change a team member's voting power
    /// @param name An identifier for this proposal
    /// @param member The member for which to change his voting power
    /// @param individualVotingPower the new voting power for this member
    function proposeSetIndividualVotingPower(
        string memory name,
        address member,
        uint256 individualVotingPower
    ) public onlyMembers {
        bytes32[] memory votingOptions;
        _setProposal(
            name,
            ProposalType.SetIndividualVotingPower,
            0,
            0,
            member,
            individualVotingPower,
            votingOptions
        );
    }

    /// @notice Propose to change the default voting power for new members
    /// @param name An identifier for this proposal
    /// @param _defaultVotingPower the new default voting power for new members
    /// @dev note that existing members keep their current voting power
    function proposeSetDefaultVotingPower(
        string memory name,
        uint256 _defaultVotingPower
    ) public onlyMembers {
        bytes32[] memory votingOptions;
        _setProposal(
            name,
            ProposalType.SetDefaultVotingPower,
            0,
            0,
            address(0),
            _defaultVotingPower,
            votingOptions
        );
    }

    /// @notice Generic function to generate one type of proposal for all proposal types
    /// @param _name An identifier for this proposal
    /// @param _proposalType Type of proposal
    /// @param _startTime Only used for voting proposal, the startTime of the vote
    /// @param _endTime Only used for voting proposal, the endTime of the vote
    /// @param _payloadAddress a store for an address parameter
    /// @param _payloadAddress a store for a number parameter
    /// @param _votingOptions a bytes32 array of options, used in a voting proposal
    function _setProposal(
        string memory _name,
        ProposalType _proposalType,
        uint256 _startTime,
        uint256 _endTime,
        address _payloadAddress,
        uint256 _payloadNumber,
        bytes32[] memory _votingOptions
    ) internal {
        require(
            proposals[msg.sender].quorum.length == 0,
            "Cannot overwrite proposal!"
        );
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

    /// @notice Remove your own proposal
    function removeProposal() public onlyMembers {
        delete proposals[msg.sender];
    }

    /// @notice get the current proposal from a team member
    /// @param proposer the address of the team member whose proposal you want to retreive
    /// @dev Normally we would retreive from the mapping itself, but somehow it does not return the arrays correct
    function getProposal(address proposer)
        public
        view
        returns (
            string memory name,
            VotingToken votingToken,
            ProposalType proposalType,
            address[] memory quorum,
            uint256 startTime,
            uint256 endTime,
            address payloadAddress,
            uint256 payloadNumber,
            bytes32[] memory votingOptions
        )
    {
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

    /// @notice Give support to proposal from another team member
    /// @param proposer the address from the team member whose proposal you want to support
    /// @dev note that the proposal is activated if the quorum is reached
    function supportProposal(address proposer) public onlyMembers {
        proposals[proposer].quorum.push(msg.sender);
        if (_quorumReached(proposals[proposer].quorum)) {
            activateProposal(proposer);
        }
    }

    /// @notice Activate a prososal from a team member
    /// @param proposer address of the team member whose proposal should be activated
    /// @dev the proposal is deleted after successfully activated
    function activateProposal(address proposer) public {
        require(_quorumReached(proposals[proposer].quorum), "Quorum not reached!");
        if (proposals[proposer].proposalType == ProposalType.SetQuorumPercentage) {
            _setQuorumPercentage(proposals[proposer].payloadNumber);
        } else if (proposals[proposer].proposalType == ProposalType.AddMember) {
            _addMember(proposals[proposer].payloadAddress);
            votingPower[proposals[proposer].payloadAddress] = defaultVotingPower;
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

    /// @notice Create vote - proposed by a member
    /// @param proposer address of the team member containing the voting proposal
    function createVote(address proposer) internal {
        require(
            proposals[proposer].quorum.length > 0,
            "Proposal does not exist!"
        );
        require(
            proposals[proposer].proposalType == ProposalType.Vote,
            "Proposal is not a vote!"
        );
        require(
            _quorumReached(proposals[proposer].quorum),
            "No quorum majority reached yet!"
        );
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
