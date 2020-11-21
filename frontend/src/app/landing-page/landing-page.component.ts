import { Component, OnInit } from '@angular/core';
import { EthereumService } from '../services/ethereum.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(public ethereumService: EthereumService) { }

  ngOnInit(): void {
  }

}
