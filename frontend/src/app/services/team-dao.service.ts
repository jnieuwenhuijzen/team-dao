import { Injectable } from '@angular/core';
import { MetaMaskService } from './metamask.service';
import { ethers } from 'ethers';

// Get the ABI from the truffle project. Expect it to be built
const teamDaoAbi = require('../../../../team-dao/build/contracts/TeamDao.json').abi;
const teamDaoBytecode = require('../../../../team-dao/build/contracts/TeamDao.json').bytecode;

@Injectable({
  providedIn: 'root'
})
export class TeamDaoService {
  private contract: any = undefined;
  contractAddress = '';

  // Blockchain parameters that are updated on basis of events
  cache: any = {
    paused: false,
    pauser: '',
    members: []
  };

  provider = new ethers.providers.Web3Provider(this.metaMaskService.ethereum);
  signer = this.provider.getSigner();

  constructor(private metaMaskService: MetaMaskService) { }

  async deployTeamDao(): Promise<any> {
    const contractFactory = new ethers.ContractFactory(teamDaoAbi, teamDaoBytecode, this.signer);
    const contract = await contractFactory.deploy([100]);
    await contract.deployTransaction.wait();
    this.setContract(contract.address);
    console.log(contract);
  }

  async setContract(address: string): Promise<void> {
    if (address === '') {
      this.contract = undefined;
      this.contractAddress = address;
    } else {
      this.contract = new ethers.Contract(address, teamDaoAbi, this.signer);
      this.contractAddress = address;
      try {
        await Promise.all([
          this.setEvents(),
          this.getAll()
        ]);
      } catch (err) {
        alert('Error reading contract!');
        this.contract = undefined;
        this.contractAddress = '';
        throw (err);
      }
    }
  }

  async proposeSetQuorumPercentage(name: string, percentage: number): Promise<any> {
    return await this.contract.proposeSetQuorumPercentage(name, percentage);
  }

  async proposeAddMember(name: string, address: string): Promise<any> {
    return await this.contract.proposeAddMember(name, address);
  }

  async proposeRemoveMember(name: string, address: string): Promise<any> {
    return await this.contract.proposeRemoveMember(name, address);
  }

  async proposeSetIndividualVotingPower(name: string, address: string, votingPower: number): Promise<any> {
    return await this.contract.proposeSetIndividualVotingPower(name, address, votingPower);
  }

  async proposeSetDefaultVotingPower(name: string, votingPower: number): Promise<any> {
    return await this.contract.proposeSetDefaultVotingPower(name, votingPower);
  }

  async proposeSetPauser(name: string, address: string): Promise<any> {
    return await this.contract.proposeSetPauser(name, address);
  }

  async pause(): Promise<any> {
    return await this.contract.pause();
  }

  async unpause(): Promise<any> {
    return await this.contract.unpause();
  }

  async getMembers(): Promise<any[]> {
    const totalMembers = await this.contract.totalMembers();
    this.cache.totalMembers = totalMembers;
    const res: any[] = [];
    for (let index = 1; index <= totalMembers; index++) {
      const address = await this.contract.members(index - 1);
      const votingPower = await this.contract.votingPower(address);
      res.push({
        index,
        address,
        votingPower,
      });
    }
    this.cache.members = res;
    return res;
  }

  async getPauser(): Promise<string> {
    this.cache.pauser = await this.contract.pauser();
    return this.cache.paused;
  }

  async getPaused(): Promise<boolean> {
    this.cache.paused = await this.contract.paused();
    return this.cache.paused;
  }

  async getProposals(): Promise<any> {
    const totalMembers = await this.contract.totalMembers();
    const res: any[] = [];
    for (let i = 0; i < totalMembers; i++) {
      const address = await this.contract.members(i);
      const proposalFields = await this.contract.getProposal(address);
      res.push({
        address,
        ...proposalFields
      });
    }
    this.cache.proposals = res;
    return res;
  }

  async removeProposal(): Promise<any> {
    return await this.contract.removeProposal();
  }

  async supportProposal(address: string): Promise<any> {
    return await this.contract.supportProposal(address);
  }

  async activateProposal(address: string): Promise<any> {
    return await this.contract.activateProposal(address);
  }

  async getQuorumPercentage(): Promise<number> {
    this.cache.quorumPercentage = await this.contract.quorumPercentage();
    return this.cache.quorumPercentage;
  }

  async getDefaultVotingPower(): Promise<number> {
    this.cache.defaultVotingPower = await this.contract.defaultVotingPower();
    return this.cache.defaultVotingPower;
  }

  proposalType(type: number): string {
    switch (type) {
      case 0:
        return 'Set Quorum Percentage';
      case 1:
        return 'Add Member';
      case 2:
        return 'Remove Member';
      case 3:
        return 'Vote';
      case 4:
        return 'Set Individual Voting Power';
      case 5:
        return 'Set Default Voting Power';
      case 6:
        return 'Set Pauser';
      default:
        return '';
    }
  }

  async setEvents(): Promise<void> {
    this.contract.on('SupportProposal', (from: string, to: string, name: string) => {
      console.log(`Support from ${from} to ${to} for ${name}`);
      this.getProposals();
    });

    this.contract.on('CreateProposal', (from: string, name: string) => {
      console.log(`${from} proposes '${name}'`);
      this.getProposals();
    });

    this.contract.on('ActivateProposal', (from: string, proposer: string, name: string, proposalType: number) => {
      console.log(`${from} activates proposal '${name}' from ${proposer}`);
      this.getAll();
    });

    this.contract.on('RemoveProposal', (from: string, name: string) => {
      console.log(`${from} removed his proposal '${name}'`);
      this.getProposals();
    });

    this.contract.on('Paused', (from: string) => {
      console.log(`${from} paused the contract`);
      this.cache.paused = true;
    });

    this.contract.on('Unpaused', (from: string) => {
      console.log(`${from} unpaused the contract`);
      this.cache.paused = false;
    });

  }

  async getAll(): Promise<void> {
    await Promise.all([
      this.getPauser(),
      this.getPaused(),
      this.getMembers(),
      this.getProposals(),
      this.getDefaultVotingPower(),
      this.getQuorumPercentage()
    ]);
  }

}
