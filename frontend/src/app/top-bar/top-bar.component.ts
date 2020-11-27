import { Component, OnInit } from '@angular/core';
import { MetaMaskService } from '../services/metamask.service';
import { TeamDaoService } from '../services/team-dao.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  constructor(
    public metaMaskService: MetaMaskService,
    public teamDaoService: TeamDaoService) { }

  async ngOnInit(): Promise<void> {
  }

  getAddressValue(): string {
    return (this.metaMaskService.network
      ? this.metaMaskService.network + ' - ' : '')
      + this.metaMaskService.addressShort(this.metaMaskService.address);
  }

  async pause(): Promise<void> {
    await this.teamDaoService.pause();
  }

  async unpause(): Promise<void> {
    await this.teamDaoService.unpause();
  }

}
