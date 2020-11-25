import { Component, OnInit } from '@angular/core';
import { MetaMaskService } from '../services/metamask.service';
import { TeamDaoService } from '../services/team-dao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members: any[] = [];

  constructor(
    public metaMaskService: MetaMaskService,
    public teamDaoService: TeamDaoService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    if (!this.teamDaoService.contractAddress) {
      this.router.navigateByUrl('/landing', { replaceUrl: true });
    } else {
      try {
        this.members = await this.teamDaoService.getMembers();
      } catch (err) {
        this.teamDaoService.setContract('');
        this.router.navigateByUrl('/landing', { replaceUrl: true });
        alert('Cannot read contract');
        throw(err);
      }
    }
  }


}
