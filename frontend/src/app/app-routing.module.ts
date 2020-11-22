import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MembersComponent } from './members/members.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { ActiveVotesComponent } from './active-votes/active-votes.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'landing-page' },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'members', component: MembersComponent },
  { path: 'proposals', component: ProposalsComponent },
  { path: 'active-votes', component: ActiveVotesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
