import { Injectable } from '@angular/core';

declare global {
  interface Window {
    ethereum: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MetaMaskService {
  ethereum = window.ethereum;
  metaMaskInstalled = true;
  address = '';
  network = '';
  // To detect change outside the Angular zone we keep track and trigger with this a change inside
  private changeOutsideZone = false;

  constructor() {
    if (!window.ethereum) {
      // MetaMask not installed
      this.metaMaskInstalled = false;
      return;
    }

    // Capture change outside of the Angular zone
    setInterval(() => {
      if (this.changeOutsideZone) { this.changeOutsideZone = false; }
    }, 500);

    this.ethereum.on('chainChanged', () => {
      this.setNetwork();
      this.changeOutsideZone = true;
    });

    this.ethereum.on('accountsChanged', (accounts: string[]) => {
      this.address = accounts[0];
      this.setNetwork();
      this.changeOutsideZone = true;
    });

  }

  // Force open MetaMask
  async connect(): Promise<void> {
    this.address = (await this.ethereum.request({ method: 'eth_requestAccounts' }))[0];
  }

  // Return address in short format
  addressShort(address: string): string {
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

  // Translate network name according to chainId
  private setNetwork(): void {
    switch (this.ethereum.chainId) {
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
      case '0x5':
        this.network = 'Goerli';
        break;
      case '0x6':
        this.network = 'Kotti';
        break;
      case '0x2a':
        this.network = 'Kovan';
        break;
      default:
        this.network = '';
    }
  }
}
