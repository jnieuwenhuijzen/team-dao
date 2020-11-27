import { Component, OnInit } from '@angular/core';
import { MetaMaskService } from '../services/metamask.service';
import { TeamDaoService } from '../services/team-dao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent implements OnInit {
  createProposalType = -1;
  inputAddress = '';
  inputNumber = undefined;
  detailsIdx = '';
  details = {
    address: '',
    proposalType: 0,
    payloadAddress: '',
    payloadNumber: 0,
    quorum: []
  };

  constructor(
    public metaMaskService: MetaMaskService,
    public teamDaoService: TeamDaoService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    if (!this.teamDaoService.contractAddress) {
      this.router.navigateByUrl('/landing', { replaceUrl: true });
    }
  }

  setDetails(proposal: any): void {
    for (const idx in this.teamDaoService.cache.proposals) {
      if (this.teamDaoService.cache.proposals[idx].address === proposal.address) {
        this.detailsIdx = idx;
      }
    }
    this.details = this.teamDaoService.cache.proposals[this.detailsIdx];
  }

  getQuorum(proposal: any): string {
    return `${proposal.quorum.length} / ${this.teamDaoService.cache.totalMembers}`;
    // return `${Math.floor(proposal.quorum.length / this.totalMembers * 100)}%`;
  }

  getQuorumReach(proposal: any): number {
    return Math.floor(proposal.quorum.length /
      this.teamDaoService.cache.totalMembers * 100 * 100 /
      this.teamDaoService.cache.quorumPercentage);
  }

  setProposalType(type: number): void {
    this.createProposalType = type;
  }

  supported(proposal: any): boolean {
    for (const address of proposal.quorum) {
      if (address.toLowerCase() === this.metaMaskService.address) {
        return true;
      }
    }
    return false;
  }

  async proposeSetQuorumPercentage(): Promise<void> {
    try {
      await this.teamDaoService.proposeSetQuorumPercentage('v0.1', this.inputNumber || 0);
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }

  async proposeAddMember(): Promise<void> {
    try {
      await this.teamDaoService.proposeAddMember('v0.1', this.inputAddress);
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }

  async proposeRemoveMember(): Promise<void> {
    try {
      await this.teamDaoService.proposeRemoveMember('v0.1', this.inputAddress);
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }

  async proposeSetIndividualVotingPower(): Promise<void> {
    try {
      await this.teamDaoService.proposeSetIndividualVotingPower('v0.1', this.inputAddress, this.inputNumber || 0);
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }

  async proposeSetDefaultVotingPower(): Promise<void> {
    try {
      await this.teamDaoService.proposeSetDefaultVotingPower('v0.1', this.inputNumber || 0);
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }

  async proposeSetPauser(): Promise<void> {
    this.teamDaoService.proposeSetPauser('v0.1', this.inputAddress);
  }

  async removeProposal(): Promise<void> {
    try {
      await this.teamDaoService.removeProposal();
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }

  async activateProposal(address: string): Promise<void> {
    try {
      await this.teamDaoService.activateProposal(address);
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }

  async support(address: string): Promise<void> {
    try {
      await this.teamDaoService.supportProposal(address);
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }
}
