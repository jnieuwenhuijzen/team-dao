# TeamDAO

## Table of contents

* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features and Status](#features-and-status)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

## General info

TeamDAO is a DAO contract that allows teams of any size to manage their teams' composition and member voting power through a fixed number of proposals. The proposals can be adopted by means of quorum majority of the members of the team. 
 
Members can also propose on self created multiple-choice questions, each team question governed with a unique time-constrained and ERC20 compliant voting token. For each vote a new set of tokens is created and distributed among the team members. Members will be able to cast their votes by timely sending token amounts to the address(es) of choice. 

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

To run this project, the following packages are required to be installed (version above advised, but other version might work):

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

## Features and Status

The following proposals are fully implemented:

- **Add Member**: Add new member to the team.
- **Remove Member**: Remove a member from the team.
- **Set Quorum Percentage**: Set the percentage of supporting team members to have a proposal activated.
- **Set Pauser**: To freeze the contract in case of emergency, one address can be assigned the pause functionality. This address does not have to be from a member of the team.

## Inspiration

## Contact

