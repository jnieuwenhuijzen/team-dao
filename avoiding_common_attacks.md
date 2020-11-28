# Avoiding common attacks

This document explains the security steps and measures taken to ensure the `TeamDao` and `VotingToken` contract are not suceptible to common attacks.

## Re-entrancy Attacks (SWC-107)

Re-entrancy becomes possible when the contract makes calls to another contract. In case of the TeamDAO, the contract calls functions only from the VotingToken contract. Specifically, as the owner and creator of the VotingToken it will mint tokens for each member.

The VotingToken contract has an extra prerequisite: Tokens can only be transferred or minted when ownership is renounced. This makes it less likely to be susceptible for re-entrancy. so once it has been created and activated, the TeamDAO contract can no longer influence the VotingToken contract.

## Transaction Ordering and Timestamp Dependence (SWC-114)

The result can not be changed with transaction ordering.

## Integer Overflow and Underflow (SWC-101)

All contracts make use of the SafeMath implementation from Openzeppelin where necessary.

## Denial of Service with Failed Call (SWC-113)

TeamDao and VotingToken contracts do not call other contracts, which make it less susceptible to this kind of attack. 

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



 