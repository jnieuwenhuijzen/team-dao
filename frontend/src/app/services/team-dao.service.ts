import { Injectable } from '@angular/core';
import { MetaMaskService } from './metamask.service';
import { ethers } from 'ethers';
import { Router } from '@angular/router';
import { MembersComponent } from '../members/members.component';

// Get the ABI from the truffle project. Expect it to be built
const teamDaoAbi  = require('../../../../team-dao/build/contracts/TeamDao.json').abi;
@Injectable({
  providedIn: 'root'
})
export class TeamDaoService {
  private contract: any = undefined;
  contractAddress = '';

  provider = new ethers.providers.Web3Provider(this.metaMaskService.ethereum);

  constructor(private metaMaskService: MetaMaskService) {
   }

   setContractAddress(address: string): void {
     if (address !== '') {
       this.contract = new ethers.Contract(address, teamDaoAbi, this.provider);
     }
     this.contractAddress = address;
   }

   async getMembers(): Promise<string[]> {
    const totalMembers = await this.contract.totalMembers();
    const res: string[] = [];
    for (let i = 0; i < totalMembers; i++) {
      res.push(await this.contract.members(i));
    }
    return res;
  }
}
