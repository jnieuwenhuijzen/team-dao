# TeamDAO

## Table of contents

* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [License](#license)

## General info

TeamDAO is a DAO contract that teams of any size can use to manage the team composition and member voting power through a number of proposals. The proposals will be adopted when quorum majority among the team members is achieved. 
 
Members can also propose on self created multiple-choice questionaires, where each questionaire is governed with a unique time-constrained and ERC20 compliant voting token. For each vote a new set of tokens is created and distributed among the team members. Members will be able to cast their votes by simply sending token amounts to the voting address(es) of choice. 

*Todo: The GUI for creating/sending/showing votes is not implemented yet*

## Technologies

The project is created with:

- Bootstrap 4.5.3
- Angular 11.0.2
- Nodejs 12.19.1
- Truffle 5.1.47
- Ganache-cli v6.11.0
- Solidity 0.6.12
- Ethers.js 5.0.22

## Setup

To run this project, the following packages are required (versions as stated above are advised, but other version might work):

- npm / nodejs
- truffle (installed globally with `npm i -g truffle`)
- ganache-cli (installed globally with `npm i -g ganache-cli`)
- MetaMask (as extension in your browser)

The project is divided in a frontend and backend (team-dao) part. To setup each part, follow these steps: 

Clone the project from github to a local directory. Enter the directory and then:

### team-dao

To prepare for usage:

```
$ cd team-dao
$ truffle compile
```

Optionally if you want to test the contracts, start ganache in a separate terminal:

```
ganache-cli
```

Start the tests in another terminal as follows:

```
truffle test
```

If you want to use a fixed mnemonic later on in the frontend, place the mnemonic 12 words in a file `.mnemonic` in the current directory. This is not mandatory but for convenience if you want to test locally with Metamask.

### frontend

Install the required packages:

```
cd ../frontend/
npm i
```

If you want to use a local ganache as blockchain and run ganache-cli with the mnemonic mentioned earlier, stop the previous ganache-cli and start it up with the following script:

```
npm run ganache
```

start the development server for serving the frontend:

```
npm run start
``` 

You can now visit the local URL *http://localhost:4200*. Be sure to have MetaMask installed to make full use of the TeamDAO.

## Features

To start a TeamDAO interface you have two options:

- **Join an existing team**: If your TeamDAO already exist you can (re)join it by entering the smart contract address from the TeamDAO.
- **Create a new team**: If you want to create a new TeamDAO, you can simply press the create button on the landing page and a new contract will be deployed. As creator of this team you will be the first team member and you will be assigned the pause functionality. As the sole member of the team, you will initially always reach quorum for a proposal. Note that this will change once you add the first new member. The quorum percentage is initialized to 60%.

The interface further provides for ..

- .. the pauser to **pause** or **unpause** the contract in case of emergency
- .. a team member to **add a proposal**
- .. a team member to **remove its own proposal**
- .. a team member to **support another team member's proposal**
- .. a team member to **activate a proposal** (This normally happens automically, but not in the case that majority is reached through a decrease of quorum percentage or removal of a team member)
- .. everyone to **view the details of a proposal**

Each member can make one proposal at the time. The following proposals are currently available:

- **Add Member**: Add new member to the team.
- **Remove Member**: Remove a member from the team.
- **Set Quorum Percentage**: Set the percentage of supporting team members to have a proposal activated.
- **Set Pauser**: To freeze the contract in case of emergency, one address can be assigned the pause functionality. This address does not have to be from a member of the team. Initially it will be the creator/first team member of the TeamDAO. If the team does not want to use the pause functionality, it can be set to address(0).
- **Set Individual Voting Power**: The amount of voting tokens that will be assigned per vote to an individual team member.
- **Set Default Voting Power**: The default amount of voting tokens. This value is used to initialize the individual voting power for a new team member.

## Status

The following proposals are not yet fully implemented:

- **Vote**: The idea is to vote with an ERC20 token. The intended use is that for each vote a new voting token is created and distributed among the team members. This token can be transferred freely to everyone, but constrained to a predetermined time frame. Once out of this time frame, the tokens will be frozen and the vote is final. Voting will be done with a multiple choice type of questionaire, where each voting option will be assigned a unique random address. This random address is created by the teamDao contract. The amount of tokens a voting address receives stands for the support that has been given to this voting option. The VotingToken contract has already been implemented and tested. What still needs to be built is the interface/GUI, specifically:
  - Build a form for composing a multiple-choice question. This can be used as input for the 'Vote' proposal
  - Build a display where the active votes (the multiple choice questions) are shown. Users of the interface should be able to express their support for each of the options by transferring an amount of the specific voting token to one or more of the voting option addresses.
  - Build a display where the results of all closed votes are still visible.
  - Setup for an IPFS interface. The stored information on the chain for each option currently consists of a bytes[32] array. IPFS officially requires 2 extra prefix bytes 0x1220, these have not yet been taken into account and might need improvement in the VotingToken contract.
- **Transfer**: It seems straightforward to extend the functionality with a 'Transfer' proposal, where ERC20 tokens that are owned by the TeamDAO contract can be sent to other addresses. This way the TeamDAO can also be used to store and manage value. ERC20 token interface should allow for handling both fungible and non-fungible tokens. Next to that it might be optional to also allow for transferring Ether, but it might be easier (and with less attack vectors?) to only accept Ether in ERC20 format (wETH).

## License

MIT License (including **all** dependencies).

