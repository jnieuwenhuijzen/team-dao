import { Injectable } from '@angular/core';

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
  addressChanged = false;
  networkChanged = false;

  constructor() {
    // Capture change outside of the Angular zone
    setInterval(() => {
      if (this.addressChanged) { this.addressChanged = false; }
      if (this.networkChanged) { this.networkChanged = false; }
    }, 500);

    window.ethereum.on('chainChanged', (network: string) => {
      switch (window.ethereum.chainId) {
        case '0x1':
          this.network = 'Mainnet';
          break;
        case '0x2':
          this.network = 'Morden';
          break;
        case '0x3':
          this.network = 'Ropsten';
          break;
        case '0x4':
          this.network = 'Rinkeby';
          break;
        case '0x2a':
          this.network = 'Kovan';
          break;
        default:
          this.network = '';
      }
      this.networkChanged = true;
    });

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      this.address = accounts[0];
      this.addressChanged = true;
    });

  }


  async connect(): Promise<void> {
    this.address = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
  }
}
