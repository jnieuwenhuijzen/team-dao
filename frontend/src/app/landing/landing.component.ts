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

  joinTeam(): void {
    this.teamDaoService.setContractAddress(this.contractAddress);
    this.router.navigateByUrl('/members', { replaceUrl: true });
  }

  createTeam(): void {
  }

  switchTeam(): void {
    this.contractAddress = '';
    this.teamDaoService.setContractAddress(this.contractAddress);
  }
}
