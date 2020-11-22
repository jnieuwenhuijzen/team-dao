import { Component, OnInit } from '@angular/core';
import { MetaMaskService } from '../services/metamask.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(public metaMaskService: MetaMaskService) { }

  ngOnInit(): void { }

  getAddressValue(): string {
    return (this.metaMaskService.network
      ? this.metaMaskService.network + ' - ' : '')
      + this.metaMaskService.addressShort();
  }

}
