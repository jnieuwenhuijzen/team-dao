import { Injectable } from '@angular/core';
import { MetaMaskService } from './metamask.service';
import { ethers } from 'ethers';
import { Router } from '@angular/router';
import { MembersComponent } from '../members/members.component';

// Get the ABI from the truffle project. Expect it to be built
const teamDaoAbi = require('../../../../team-dao/build/contracts/TeamDao.json').abi;
@Injectable({
  providedIn: 'root'
})
export class TeamDaoService {
  private contract: any = undefined;
  contractAddress = '';

  cache: any = {};

  provider = new ethers.providers.Web3Provider(this.metaMaskService.ethereum);
  signer = this.provider.getSigner();

  constructor(private metaMaskService: MetaMaskService) {
  }

  setContract(address: string): void {
    if (address === '') {
      this.contract = undefined;
    } else {
      this.contract = new ethers.Contract(address, teamDaoAbi, this.signer);
    }
    this.contractAddress = address;
  }

  async totalMembers(): Promise<number> {
    return await this.contract.totalMembers();
  }

  async getMembers(): Promise<any[]> {
    const totalMembers = await this.contract.totalMembers();
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
    const res: number = await this.contract.quorumPercentage();
    this.cache.quorumPercentage = res;
    return res;
  }

  async defaultVotingPower(): Promise<number> {
    const res: number = await this.contract.defaultVotingPower();
    this.cache.defaultVotingPower = res;
    return res;
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
      default:
        return '';
    }
  }
}




/*
string memory name,
VotingToken votingToken,
ProposalType proposalType,
address[] memory quorum,
uint256 startTime,
uint256 endTime,
address payloadAddress,
uint256 payloadNumber,
bytes32[] memory votingOptions
*/
