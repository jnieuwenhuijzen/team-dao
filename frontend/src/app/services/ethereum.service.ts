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
  address: string;

  constructor() {
    this.address = '';
  }

  async connect(): Promise<void> {
    this.address = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
  }
}
