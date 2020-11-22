import { Component, OnInit } from '@angular/core';
import { MetaMaskService } from '../services/metamask.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  constructor(public metaMaskService: MetaMaskService) { }

  ngOnInit(): void {
  }

}
