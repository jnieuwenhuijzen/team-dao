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

  constructor(
    public metaMaskService: MetaMaskService,
    public teamDaoService: TeamDaoService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    if (!this.teamDaoService.contractAddress) {
      this.router.navigateByUrl('/landing', { replaceUrl: true });
    } else {
      try {
        this.proposals = await this.teamDaoService.getProposals();
        console.log(this.proposals)
      } catch (err) {
        console.log(err);
        this.teamDaoService.setContract('');
        this.router.navigateByUrl('/landing', { replaceUrl: true });
        alert('Error reading contract');
      }
    }
  }

}
