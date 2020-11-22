import { Component, OnInit } from '@angular/core';
import { MetaMaskService } from '../services/metamask.service';
import { TeamDaoService } from '../services/team-dao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-active-votes',
  templateUrl: './active-votes.component.html',
  styleUrls: ['./active-votes.component.css']
})
export class ActiveVotesComponent implements OnInit {

  constructor(
    public metaMaskService: MetaMaskService,
    public teamDaoService: TeamDaoService,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.teamDaoService.contractAddress) {
      this.router.navigateByUrl('/landing-page', { replaceUrl: true });
    }
  }

}
