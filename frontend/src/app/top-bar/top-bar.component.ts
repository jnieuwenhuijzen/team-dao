import { Component, OnInit } from '@angular/core';
import { EthereumService } from '../services/ethereum.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(private ethereumService: EthereumService) { }

  ngOnInit(): void {
  }

  async connectMetamask(): Promise<void> {
    await this.ethereumService.connect();
  }

  addressButtonValue(): string {
    return this.ethereumService.address ? this.ethereumService.address : 'connect..';
  }
}
