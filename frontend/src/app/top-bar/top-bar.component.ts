import { Component, OnInit } from '@angular/core';
import { EthereumService } from '../services/ethereum.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(public ethereumService: EthereumService) { }

  ngOnInit(): void { }

  getAddressValue(): string {
    return (this.ethereumService.network
      ? this.ethereumService.network + ' - ' : '')
      + this.ethereumService.addressShort();
  }

}
