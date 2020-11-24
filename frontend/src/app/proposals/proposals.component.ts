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
  details = {};

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
    await this.teamDaoService.proposeSetQuorumPercentage('v0.1', this.inputNumber);
  }

  async proposeAddMember(): Promise<void> {
    await this.teamDaoService.proposeAddMember('v0.1', this.inputAddress);
  }

  async proposeRemoveMember(): Promise<void> {
    await this.teamDaoService.proposeRemoveMember('v0.1', this.inputAddress);
  }

  async proposeSetIndividualVotingPower(): Promise<void> {
    await this.teamDaoService.proposeSetIndividualVotingPower('v0.1', this.inputNumber);
  }

  async proposeSetDefaultVotingPower(): Promise<void> {
    await this.teamDaoService.proposeSetDefaultVotingPower('v0.1', this.inputNumber);
  }

  async removeProposal(): Promise<void> {
    await this.teamDaoService.removeProposal();
  }

  async support(address: string): Promise<void> {
    await this.teamDaoService.supportProposal(address);
  }
}
