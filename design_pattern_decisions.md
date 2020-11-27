# Avoiding common attacks

This document explains the security steps and what measures have been taken to ensure the `Teamdao` and `VotingToken` contracts are not susceptible to common attacks.

## Fail early and fail loud

Requirements are used and placed as early as possible in all contract functions. Modifiers are used where applicable and will throw on failure.

## Restricting Access

The functions `_setProposal` and `createVote` from the contract [TeamDao.sol](https://github.com/jnieuwenhuijzen/team-dao/blob/master/team-dao/contracts/TeamDao.sol) are made `internal`. Although `private` would be an option, the functions are made `internal` to make derivation possible.

In [WithMembers.sol](https://github.com/jnieuwenhuijzen/team-dao/blob/master/team-dao/contracts/WithMembers.sol) the functions `_addMember`, `_removeMember`, `, `_setQuorumPercentage`, `_quorumReached` and the helper functions `_firstOccurence` and `occurence` are all internal. These functions are derived and only to be executed by the `TeamDao.sol` contract.

The contract [VotingToken.sol](https://github.com/jnieuwenhuijzen/team-dao/blob/master/team-dao/contracts/VotingToken.sol) derives from the Openzeppelin contract `ERC20Burnable`. It uses the hook `_BeforeTokenTransfer` to implement some prerequisites before transferring. This function is also `internal`.

## Auto Deprecation

Although not having used the specific `Autodeprecate` contract, the [VotingToken.sol](https://github.com/jnieuwenhuijzen/team-dao/blob/master/team-dao/contracts/VotingToken.sol) contract is implemented in such a way that tokens cannot be sent before or after a certain date and time.

## Circuit Breaker

The circuit breaker pattern is implemented using the Openzeppelin contract `Pausable`. In the implementation of [TeamDao.sol](https://github.com/jnieuwenhuijzen/team-dao/blob/master/team-dao/contracts/TeamDao.sol) team members can propose to change the address of the pauser or e.g. set it to address(0). Initially the creator of the contract is the first member and also the pauser.
