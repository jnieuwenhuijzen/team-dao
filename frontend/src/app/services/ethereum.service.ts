import { Injectable } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';

declare global {
  interface Window {
    ethereum: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EthereumService {
  address = '';
  network = '';
  change = false;

  constructor() {
    // Capture change outside of the Angular zone
    setInterval(() => {
      if (this.change) { this.change = false; }
    }, 500);

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      this.address = accounts[0];
      this.change = true;
    });
    window.ethereum.on('networkChanged', (network: string) => {
      switch (network) {
        case '1':
          this.network = 'Mainnet';
          break;
        case '2':
          this.network = 'Morden';
          break;
        case '3':
          this.network = 'Ropsten';
          break;
        case '4':
          this.network = 'Rinkeby';
          break;
        case '42':
          this.network = 'Kovan';
          break;
        default:
          this.network = '';
      }
      this.change = true;
    });
  }

  async connect(): Promise<void> {
    this.address = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
  }
}
