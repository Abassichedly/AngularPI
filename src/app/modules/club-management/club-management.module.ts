import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ClubManagementRoutingModule } from './club-management-routing.module';

// Layout Components
import { ClubLayoutComponent } from './components/layout/club-layout.component';
import { SidebarComponent } from './components/layout/sidebar.component';

// Club Components
import { ClubListComponent } from './components/club/club-list.component';
import { ClubFormComponent } from './components/club/club-form.component';
import { ClubDetailComponent } from './components/club/club-detail.component';

// Member Components
import { MemberListComponent } from './components/member/member-list.component';
import { MemberFormComponent } from './components/member/member-form.component';
import { MemberDetailComponent } from './components/member/member-detail.component';

// Activity Components
import { ActivityListComponent } from './components/activity/activity-list.component';
import { ActivityFormComponent } from './components/activity/activity-form.component';
import { ActivityDetailComponent } from './components/activity/activity-detail.component';

// Event Components
import { EventListComponent } from './components/event/event-list.component';
import { EventFormComponent } from './components/event/event-form.component';
import { EventDetailComponent } from './components/event/event-detail.component';

// Participation Components
import { ParticipationListComponent } from './components/participation/participation-list.component';
import { ParticipationFormComponent } from './components/participation/participation-form.component';

// Dashboard Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StatsCardComponent } from './components/dashboard/widgets/stats-card.component';
import { ActivityHeatmapComponent } from './components/dashboard/widgets/activity-heatmap.component';
import { ClubHealthComponent } from './components/dashboard/widgets/club-health.component';
import { LeaderboardComponent } from './components/dashboard/widgets/leaderboard.component';

// Social Network Components
import { SocialNetworkComponent } from './components/social/social-network.component';
import { InfluenceScoreComponent } from './components/social/influence-score.component';
import { CommunityDetectionComponent } from './components/social/community-detection.component';
import { InteractionFormComponent } from './components/social/interaction-form.component';

// Predictive Analytics Components
import { PredictiveAnalyticsComponent } from './components/predictive/predictive-analytics.component';
import { ClubEvolutionComponent } from './components/predictive/club-evolution.component';
import { ChurnRiskComponent } from './components/predictive/churn-risk.component';
import { TrendsChartComponent } from './components/predictive/trends-chart.component';

// Gamification Components
import { GamificationComponent } from './components/gamification/gamification.component';
import { JourneyComponent } from './components/gamification/journey.component';
import { BadgesComponent } from './components/gamification/badges.component';

// Insights Components
import { InsightsComponent } from './components/insights/insights.component';
import { HeatmapComponent } from './components/insights/heatmap.component';
import { ClubComparisonComponent } from './components/insights/club-comparison.component';
import { InterestsComponent } from './components/insights/interests.component';

// AI Components
import { AiSuggestionsComponent } from './components/ai/ai-suggestions.component';
import { ActivitySuggestionCardComponent } from './components/ai/activity-suggestion-card.component';

// Matching Components
import { MatchingComponent } from './components/matching/matching.component';
import { MentorCardComponent } from './components/matching/mentor-card.component';

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
    SidebarComponent,
    
    // Club
    ClubListComponent,
    ClubFormComponent,
    ClubDetailComponent,
    
    // Member
    MemberListComponent,
    MemberFormComponent,
    MemberDetailComponent,
    
    // Activity
    ActivityListComponent,
    ActivityFormComponent,
    ActivityDetailComponent,
    
    // Event
    EventListComponent,
    EventFormComponent,
    EventDetailComponent,
    
    // Participation
    ParticipationListComponent,
    ParticipationFormComponent,
    
    // Dashboard
    DashboardComponent,
    StatsCardComponent,
    ActivityHeatmapComponent,
    ClubHealthComponent,
    LeaderboardComponent,
    
    // Social
    SocialNetworkComponent,
    InfluenceScoreComponent,
    CommunityDetectionComponent,
    InteractionFormComponent,
    
    // Predictive
    PredictiveAnalyticsComponent,
    ClubEvolutionComponent,
    ChurnRiskComponent,
    TrendsChartComponent,
    
    // Gamification
    GamificationComponent,
    JourneyComponent,
    BadgesComponent,
    
    // Insights
    InsightsComponent,
    HeatmapComponent,
    ClubComparisonComponent,
    InterestsComponent,
    
    // AI
    AiSuggestionsComponent,
    ActivitySuggestionCardComponent,
    
    // Matching
    MatchingComponent,
    MentorCardComponent,
    
    // Shared
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
    // Exporter les composants utilisés ailleurs
    DashboardComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    StatusPipe,
    DateFormatPipe
  ]
})
export class ClubManagementModule { }