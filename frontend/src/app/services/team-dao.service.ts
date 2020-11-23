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

  provider = new ethers.providers.Web3Provider(this.metaMaskService.ethereum);

  constructor(private metaMaskService: MetaMaskService) {
  }

  setContract(address: string): void {
    if (address === '') {
      this.contract = undefined;
    } else {
      this.contract = new ethers.Contract(address, teamDaoAbi, this.provider);
    }
    this.contractAddress = address;
  }

  async getMembers(): Promise<any[]> {
    const totalMembers = await this.contract.totalMembers();
    const res: any[] = [];
    for (let i = 0; i < totalMembers; i++) {
      const address = await this.contract.members(i);
      const votingPower = await this.contract.votingPower(address);
      res.push({
        address,
        votingPower
      });
    }
    return res;
  }

}
