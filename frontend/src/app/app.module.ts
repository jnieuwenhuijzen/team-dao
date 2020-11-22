import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MetaMaskService } from './services/metamask.service';
import { TeamDaoService } from './services/team-dao.service';
import { VotingTokenService } from './services/voting-token.service';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CanvasComponent } from './canvas/canvas.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MembersComponent } from './members/members.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { ActiveVotesComponent } from './active-votes/active-votes.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    CanvasComponent,
    LandingPageComponent,
    MembersComponent,
    ProposalsComponent,
    ActiveVotesComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [MetaMaskService, TeamDaoService, VotingTokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
