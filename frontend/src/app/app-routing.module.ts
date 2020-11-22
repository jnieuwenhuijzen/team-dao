import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { MembersComponent } from './members/members.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { ActiveVotesComponent } from './active-votes/active-votes.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'landing' },
  { path: 'landing', component: LandingComponent },
  { path: 'members', component: MembersComponent },
  { path: 'proposals', component: ProposalsComponent },
  { path: 'active-votes', component: ActiveVotesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
