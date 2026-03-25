import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Club } from '../../models/club';
import { InsightsService } from '../../services/insights.service';
import { PredictiveService } from '../../services/predictive.service';
import { ChartsService } from '../../services/charts.service';
import { AIService } from '../../services/ai.service';
import { GamificationService } from '../../services/gamification.service';
import { ClubService } from '../../services/club.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  selectedClubId = 1;
  clubs: Club[] = [];
  
  heatmap: any = null;
  trends: any = null;
  leaderboard: any[] = [];
  suggestions: any[] = [];
  clubHealth: any = null;
  charts: any = {};
  
  loading = {
    clubs: false,
    heatmap: false,
    trends: false,
    leaderboard: false,
    suggestions: false,
    health: false,
    charts: false
  };

  constructor(
    private insightsService: InsightsService,
    private predictiveService: PredictiveService,
    private gamificationService: GamificationService,
    private chartsService: ChartsService,
    private aiService: AIService,
    private clubService: ClubService
  ) {}

  ngOnInit(): void {
    this.loadClubs();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.clubs.length > 0) {
        this.loadDashboard();
      }
    }, 500);
  }

  loadClubs(): void {
    this.loading.clubs = true;
    this.clubService.getAll().subscribe({
      next: (data) => {
        this.clubs = data;
        if (data.length > 0) {
          this.selectedClubId = data[0].idClub!;
        }
        this.loading.clubs = false;
      },
      error: (err) => {
        console.error('Erreur chargement clubs:', err);
        this.loading.clubs = false;
      }
    });
  }

  onClubChange(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loadHeatmap();
    this.loadTrends();
    this.loadLeaderboard();
    this.loadSuggestions();
    this.loadClubHealth();
    this.loadCharts();
  }

  loadHeatmap(): void {
    this.loading.heatmap = true;
    this.insightsService.getHeatmap().subscribe({
      next: (data) => {
        this.heatmap = data;
        this.loading.heatmap = false;
      },
      error: (err) => {
        console.error('Erreur heatmap:', err);
        this.loading.heatmap = false;
      }
    });
  }

  loadTrends(): void {
    this.loading.trends = true;
    this.predictiveService.getTrends().subscribe({
      next: (data) => {
        this.trends = data;
        this.loading.trends = false;
      },
      error: (err) => {
        console.error('Erreur trends:', err);
        this.loading.trends = false;
      }
    });
  }

  loadLeaderboard(): void {
    this.loading.leaderboard = true;
    this.gamificationService.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data.slice(0, 10);
        this.loading.leaderboard = false;
      },
      error: (err) => {
        console.error('Erreur leaderboard:', err);
        this.loading.leaderboard = false;
      }
    });
  }

  loadSuggestions(): void {
    this.loading.suggestions = true;
    this.aiService.generateActivitySuggestions(this.selectedClubId).subscribe({
      next: (data) => {
        this.suggestions = data.slice(0, 5);
        this.loading.suggestions = false;
      },
      error: (err) => {
        console.error('Erreur suggestions:', err);
        this.loading.suggestions = false;
      }
    });
  }

  loadClubHealth(): void {
    this.loading.health = true;
    this.insightsService.getClubHealth(this.selectedClubId).subscribe({
      next: (data) => {
        this.clubHealth = data;
        this.loading.health = false;
      },
      error: (err) => {
        console.error('Erreur club health:', err);
        this.loading.health = false;
      }
    });
  }

  loadCharts(): void {
    this.loading.charts = true;
    this.chartsService.getDashboardCharts(this.selectedClubId).subscribe({
      next: (data) => {
        this.charts = data;
        this.loading.charts = false;
        setTimeout(() => this.renderCharts(), 200);
      },
      error: (err) => {
        console.error('Erreur charts:', err);
        this.loading.charts = false;
      }
    });
  }

  renderCharts(): void {
    if (this.charts.evolution) {
      this.renderChart('evolutionChart', this.charts.evolution);
    }
    if (this.charts.skills) {
      this.renderChart('skillsChart', this.charts.skills);
    }
    if (this.charts.activityTypes) {
      this.renderChart('activityTypesChart', this.charts.activityTypes);
    }
  }

  renderChart(canvasId: string, chartData: any): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }
    
    new Chart(ctx, {
      type: chartData.type.toLowerCase(),
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets.map((ds: any) => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.backgroundColor,
          borderColor: ds.borderColor,
          borderWidth: ds.borderWidth,
          fill: ds.fill === 'origin'
        }))
      },
      options: chartData.options || { responsive: true, maintainAspectRatio: false }
    });
  }

  getHeatmapMax(): number {
    if (!this.heatmap?.heatmap) return 0;
    return Math.max(...Object.values(this.heatmap.heatmap) as number[]);
  }

  getConfidenceColor(score: number): string {
    if (score >= 0.8) return '#28a745';
    if (score >= 0.6) return '#ffc107';
    return '#dc3545';
  }
}