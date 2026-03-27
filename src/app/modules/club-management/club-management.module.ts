import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ClubManagementRoutingModule } from './club-management-routing.module';

// Layout Components
import { ClubLayoutComponent } from './components/layout/club-layout.component';
import { NavBarComponent } from './components/layout/nav-bar.component';

// Club Components (CRUD + Details)
import { ClubListComponent } from './components/club/club-list.component';
import { ClubFormComponent } from './components/club/club-form.component';
import { ClubDetailComponent } from './components/club/club-detail.component';

// Member Components (CRUD + Details)
import { MemberListComponent } from './components/member/member-list.component';
import { MemberFormComponent } from './components/member/member-form.component';
import { MemberDetailComponent } from './components/member/member-detail.component';

// Activity Components (CRUD + Details)
import { ActivityListComponent } from './components/activity/activity-list.component';
import { ActivityFormComponent } from './components/activity/activity-form.component';
import { ActivityDetailComponent } from './components/activity/activity-detail.component';

// Event Components (CRUD + Details)
import { EventListComponent } from './components/event/event-list.component';
import { EventFormComponent } from './components/event/event-form.component';
import { EventDetailComponent } from './components/event/event-detail.component';

// Participation Components (CRUD + Details)
import { ParticipationListComponent } from './components/participation/participation-list.component';
import { ParticipationFormComponent } from './components/participation/participation-form.component';
import { ParticipationDetailComponent } from './components/participation/participation-detail.component';

// Dashboard Components
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Shared Components
import { LoadingSpinnerComponent } from './shared/components/loading-spinner.component';
import { ErrorMessageComponent } from './shared/components/error-message.component';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog.component';

// Pipes
import { StatusPipe } from './shared/pipes/status.pipe';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';

// Directives
import { TooltipDirective } from './shared/directives/tooltip.directive';

@NgModule({
  declarations: [
    // Layout
    ClubLayoutComponent,
    NavBarComponent,
    
    // Club CRUD + Details
    ClubListComponent,
    ClubFormComponent,
    ClubDetailComponent,
    
    // Member CRUD + Details
    MemberListComponent,
    MemberFormComponent,
    MemberDetailComponent,
    
    // Activity CRUD + Details
    ActivityListComponent,
    ActivityFormComponent,
    ActivityDetailComponent,
    
    // Event CRUD + Details
    EventListComponent,
    EventFormComponent,
    EventDetailComponent,
    
    // Participation CRUD + Details
    ParticipationListComponent,
    ParticipationFormComponent,
    ParticipationDetailComponent,
    
    // Dashboard
    DashboardComponent,
    
    // Shared Components
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    ConfirmationDialogComponent,
    
    // Pipes
    StatusPipe,
    DateFormatPipe,
    
    // Directives
    TooltipDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ClubManagementRoutingModule
  ],
  exports: [
    DashboardComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    StatusPipe,
    DateFormatPipe
  ]
})
export class ClubManagementModule { }