import { Injectable } from '@angular/core';
import { EthereumService } from '../services/ethereum.service';

@Injectable({
  providedIn: 'root'
})
export class TeamDaoService {
  address = '';

  constructor(private ethereumService: EthereumService) { }
}
