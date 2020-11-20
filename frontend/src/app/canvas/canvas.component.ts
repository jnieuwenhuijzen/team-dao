import { Component, OnInit } from '@angular/core';
import { EthereumService } from '../services/ethereum.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  constructor(public ethereumService: EthereumService) { }

  ngOnInit(): void {
  }

}
