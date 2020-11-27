# Avoiding common attacks

This document explains the security steps and measures taken to ensure the `TeamDao` and `VotingToken` contract are not suceptible to common attacks.

## Re-entracy Attacks (SWC-107)

The TeamDao contract creates and calls functions from the VotingToken contract. Specifically, as the owner of the VotingToken it will mint tokens for each member. As the final step it will renounce ownership.

The TeamDao contract (the owner of the new VotingToken) can only access the VotingToken functions through the internal function `CreateVote` in which the token is created, minted and ownership-renounced. 

The VotingToken contract (which is owned bij the TeamDao contract) has an extra prerequisite: Tokens can only be transferred or minted when ownership is renounced. This makes it less likely to be susceptible for re-entrancy.

## Transaction Ordering and Timestamp Dependence (SWC-114)

Although with voting privacy should be an issue (but not taken into consideration in the current setup), the result can not be changed with transaction ordering.

## Integer Overflow and Underflow (SWC-101)

All contracts make use of the SafeMath implementation from Openzeppelin where necessary.

## Denial of Service with Failed Call (SWC-113)

As the TeamDao and VotingToken contract do not call other contracts, it seems impossible to create a 'DoS with Failed Call'.

## Denial of Service by Block Gas Limit or startGas (SWC-128)

There are some arrays with undetermined size used in 
the TeamDao contract. Two arrays are used in the `proposal` struct:

 -  `quorum[]`: This part of a proposal is filled using the function `supportProposal`. There is a prerequisite in this function that requires that `msg.sender` is not allready an occurence in the array. 
 -  `votingoptions[]`: This array is created with the creation of the proposal and only by the proposer itself. It can therefor not be used to DoS other proposals than the creation of the proposal itself.

The `WithMembers` library/contract is derived by `TeamDao`. it contains an array `member[]` of undetermined size. The requirement in `_addMember` is that it may not allready be a member. Next to that, Members can only be added if the majority (the quorum) of team members agree.

## Force Sending Ether

Although not currently implemented, a future use of the contract could be to manage with the TeamDao transfers of ETH or ERC20 tokens owned by the TeamDao contract.

There would however not be any logic *dependent* on the amount of tokens available to the contract, except for the availability of tokens at time of transfer.

Self destruct pattern is not implemented in this contract.



 