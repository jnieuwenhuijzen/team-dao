import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EthereumService } from './services/ethereum.service';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CanvasComponent } from './canvas/canvas.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    CanvasComponent,
    LandingPageComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: LandingPageComponent },
    ])
  ],
  providers: [EthereumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
