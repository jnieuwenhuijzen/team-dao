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
  proposals: any[] = [];
  quorumPercentage = 0;
  totalMembers = 0;
  createProposalType = -1;
  inputAddress = '';
  inputNumber = 0;
  details: any = {};

  constructor(
    public metaMaskService: MetaMaskService,
    public teamDaoService: TeamDaoService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    if (!this.teamDaoService.contractAddress) {
      this.router.navigateByUrl('/landing', { replaceUrl: true });
    } else {
      try {
        [this.proposals, this.quorumPercentage, this.totalMembers] = await Promise.all([
          this.teamDaoService.getProposals(),
          this.teamDaoService.getQuorumPercentage(),
          this.teamDaoService.totalMembers()
        ]);
      } catch (err) {
        console.log(err);
        this.teamDaoService.setContract('');
        this.router.navigateByUrl('/landing', { replaceUrl: true });
        alert('Error reading contract');
      }
    }
  }

  setDetails(proposal: any): void {
    this.details = proposal;
    console.log(proposal);
  }

  getQuorum(proposal: any): string {
    return `${proposal.quorum.length} / ${this.totalMembers}`;
    // return `${Math.floor(proposal.quorum.length / this.totalMembers * 100)}%`;
  }

  getQuorumReach(proposal: any): number {
    return Math.floor(proposal.quorum.length / this.totalMembers * 100 * 100 / this.quorumPercentage);
  }

  setProposalType(type: number): void {
    this.createProposalType = type;
  }

  async proposeSetQuorumPercentage(): Promise<void> {
    try {
      await this.teamDaoService.proposeSetQuorumPercentage('v0.1', this.inputNumber);
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
      await this.teamDaoService.proposeSetIndividualVotingPower('v0.1', this.inputNumber);
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }

  async proposeSetDefaultVotingPower(): Promise<void> {
    try {
      await this.teamDaoService.proposeSetDefaultVotingPower('v0.1', this.inputNumber);
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }

  async removeProposal(): Promise<void> {
    try {
      await this.teamDaoService.removeProposal();
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
