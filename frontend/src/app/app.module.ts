import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { EthereumService } from './services/ethereum.service';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      // { path: '', component: ? },
    ])
  ],
  providers: [EthereumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
