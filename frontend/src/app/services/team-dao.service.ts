import { Injectable } from '@angular/core';
import { MetaMaskService } from './metamask.service';
import { ethers } from 'ethers';

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
     this.contractAddress = address;
     this.contract = new ethers.Contract(address, teamDaoAbi, this.provider);
   }
}
