import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubLayoutComponent } from './components/layout/club-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Club CRUD
import { ClubListComponent } from './components/club/club-list.component';
import { ClubFormComponent } from './components/club/club-form.component';
import { ClubDetailComponent } from './components/club/club-detail.component';

// Member CRUD
import { MemberListComponent } from './components/member/member-list.component';
import { MemberFormComponent } from './components/member/member-form.component';
import { MemberDetailComponent } from './components/member/member-detail.component';

// Activity CRUD
import { ActivityListComponent } from './components/activity/activity-list.component';
import { ActivityFormComponent } from './components/activity/activity-form.component';
import { ActivityDetailComponent } from './components/activity/activity-detail.component';

// Event CRUD
import { EventListComponent } from './components/event/event-list.component';
import { EventFormComponent } from './components/event/event-form.component';
import { EventDetailComponent } from './components/event/event-detail.component';

// Participation CRUD
import { ParticipationListComponent } from './components/participation/participation-list.component';
import { ParticipationFormComponent } from './components/participation/participation-form.component';
import { ParticipationDetailComponent } from './components/participation/participation-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ClubLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      
      // Club Routes
      { path: 'clubs', component: ClubListComponent },
      { path: 'clubs/new', component: ClubFormComponent },
      { path: 'clubs/edit/:id', component: ClubFormComponent },
      { path: 'clubs/details/:id', component: ClubDetailComponent },
      
      // Member Routes
      { path: 'members', component: MemberListComponent },
      { path: 'members/new', component: MemberFormComponent },
      { path: 'members/edit/:id', component: MemberFormComponent },
      { path: 'members/details/:id', component: MemberDetailComponent },
      
      // Activity Routes
      { path: 'activities', component: ActivityListComponent },
      { path: 'activities/new', component: ActivityFormComponent },
      { path: 'activities/edit/:id', component: ActivityFormComponent },
      { path: 'activities/details/:id', component: ActivityDetailComponent },
      
      // Event Routes
      { path: 'events', component: EventListComponent },
      { path: 'events/new', component: EventFormComponent },
      { path: 'events/edit/:id', component: EventFormComponent },
      { path: 'events/details/:id', component: EventDetailComponent },
      
      // Participation Routes
      { path: 'participations', component: ParticipationListComponent },
      { path: 'participations/new', component: ParticipationFormComponent },
      { path: 'participations/edit/:id', component: ParticipationFormComponent },
      { path: 'participations/details/:id', component: ParticipationDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubManagementRoutingModule { }