import { Component, OnInit } from '@angular/core';
import { MetaMaskService } from '../services/metamask.service';
import { TeamDaoService} from '../services/team-dao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  contractAddress = '';

  constructor(
    public metaMaskService: MetaMaskService,
    public teamDaoService: TeamDaoService,
    private router: Router) { }

  ngOnInit(): void {
  }

  async joinTeam(): Promise<void> {
    await this.teamDaoService.setContract(this.contractAddress);
    this.router.navigateByUrl('/members', { replaceUrl: true });
  }

  async createTeam(): Promise<string> {
    try {
      return await this.teamDaoService.deployTeamDao();
    } catch (err) {
      alert(err.data ? err.data.message : err.message);
      throw (err);
    }
  }

  switchTeam(): void {
    this.contractAddress = '';
    this.teamDaoService.setContract(this.contractAddress);
  }
}
