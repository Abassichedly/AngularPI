import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Club } from '../../models/club';
import { InsightsService } from '../../services/insights.service';
import { PredictiveService } from '../../services/predictive.service';
import { ChartsService } from '../../services/charts.service';
import { AIService } from '../../services/ai.service';
import { GamificationService } from '../../services/gamification.service';
import { ClubService } from '../../services/club.service';
import { SocialService } from '../../services/social.service';
import { MatchingService } from '../../services/matching.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('activityRadarChart') activityRadarChart!: ElementRef;
  @ViewChild('monthlyTrendChart') monthlyTrendChart!: ElementRef;
  @ViewChild('engagementGaugeChart') engagementGaugeChart!: ElementRef;
  @ViewChild('clubComparisonChart') clubComparisonChart!: ElementRef;

  selectedClubId = 1;
  clubs: Club[] = [];
  
  // Données principales
  heatmap: any = null;
  trends: any = null;
  leaderboard: any[] = [];
  suggestions: any[] = [];
  clubHealth: any = null;
  charts: any = {};
  
  // Statistiques avancées
  stats: any = {
    totalMembers: 0,
    activeMembers: 0,
    totalActivities: 0,
    totalEvents: 0,
    participationRate: 0,
    memberGrowth: 0,
    activityGrowth: 0,
    satisfactionScore: 0,
    topPerformingDay: '',
    mostActiveMember: '',
    upcomingEvents: 0,
    completedActivities: 0
  };
  
  // Prédictions avancées
  predictions: any = {
    nextMonthGrowth: 0,
    riskLevel: 0,
    trendingActivities: [],
    bestTimeSlot: '',
    recommendedActions: []
  };
  
  // Réseau social
  topInfluencers: any[] = [];
  communities: any[] = [];
  
  // Données pour graphiques avancés
  activityRadarData: any = null;
  monthlyTrendData: any = null;
  engagementGaugeData: any = null;
  clubComparisonData: any = null;
  
  loading = {
    clubs: false,
    heatmap: false,
    trends: false,
    leaderboard: false,
    suggestions: false,
    health: false,
    charts: false,
    stats: false,
    predictions: false,
    social: false
  };

  constructor(
    private insightsService: InsightsService,
    private predictiveService: PredictiveService,
    private gamificationService: GamificationService,
    private chartsService: ChartsService,
    private aiService: AIService,
    private clubService: ClubService,
    private socialService: SocialService,
    private matchingService: MatchingService
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
    this.loadAdvancedStats();
    this.loadPredictions();
    this.loadSocialData();
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

  loadAdvancedStats(): void {
    this.loading.stats = true;
    // Simulation de statistiques avancées - À remplacer par vos vrais services
    setTimeout(() => {
      this.stats = {
        totalMembers: 47,
        activeMembers: 38,
        totalActivities: 24,
        totalEvents: 12,
        participationRate: 81,
        memberGrowth: 23,
        activityGrowth: 45,
        satisfactionScore: 4.2,
        topPerformingDay: 'Mercredi',
        mostActiveMember: 'Ahmed Ben Ali',
        upcomingEvents: 3,
        completedActivities: 18
      };
      this.loading.stats = false;
    }, 500);
  }

  loadPredictions(): void {
    this.loading.predictions = true;
    this.predictiveService.predictClubEvolution(this.selectedClubId).subscribe({
      next: (data) => {
        this.predictions = {
          nextMonthGrowth: data.predictedMembres3Mois || 15,
          riskLevel: 0.25,
          trendingActivities: ['Atelier IA', 'Conférence Tech', 'Hackathon'],
          bestTimeSlot: 'Mercredi 18h',
          recommendedActions: [
            'Organiser plus d\'ateliers pratiques',
            'Augmenter la communication sur les réseaux sociaux',
            'Créer des événements collaboratifs'
          ]
        };
        this.loading.predictions = false;
      },
      error: (err) => {
        console.error('Erreur predictions:', err);
        this.loading.predictions = false;
      }
    });
  }

  loadSocialData(): void {
    this.loading.social = true;
    this.socialService.getInfluenceScore(1).subscribe({
      next: () => {
        this.topInfluencers = [
          { name: 'Ahmed Ben Ali', score: 92, role: 'Président', badge: '👑' },
          { name: 'Sarra Souissi', score: 85, role: 'VP', badge: '⭐' },
          { name: 'Mohamed Trabelsi', score: 78, role: 'Membre', badge: '🔥' }
        ];
        this.communities = [
          { name: 'Robotique', members: 12, color: '#667eea' },
          { name: 'IA Avancée', members: 8, color: '#764ba2' },
          { name: 'Programmation', members: 15, color: '#10b981' }
        ];
        this.loading.social = false;
      },
      error: (err) => {
        console.error('Erreur social:', err);
        this.loading.social = false;
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
    
    // Graphiques avancés
    this.renderActivityRadar();
    this.renderMonthlyTrendChart();
    this.renderEngagementGauge();
    this.renderClubComparison();
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

  renderActivityRadar(): void {
    const canvas = document.getElementById('activityRadarChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Ateliers', 'Conférences', 'Formations', 'Réunions', 'Événements sociaux', 'Compétitions'],
        datasets: [{
          label: 'Activités par type',
          data: [12, 8, 15, 10, 6, 4],
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: '#667eea',
          borderWidth: 2,
          pointBackgroundColor: '#764ba2',
          pointBorderColor: '#fff',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            ticks: { stepSize: 5 }
          }
        }
      }
    });
  }

  renderMonthlyTrendChart(): void {
    const canvas = document.getElementById('monthlyTrendChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Nettoyer le canvas existant
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        datasets: [
          {
            label: 'Membres',
            data: [25, 28, 32, 35, 38, 42, 45, 47, 50, 52, 55, 58],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.05)',
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          },
          {
            label: 'Activités',
            data: [5, 7, 10, 12, 15, 18, 20, 22, 24, 26, 28, 30],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5, // Plus compact
        plugins: {
          tooltip: { 
            mode: 'index', 
            intersect: false,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw}`
            }
          },
          legend: { 
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { size: 11 }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              font: { size: 10 }
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
              font: { size: 10 }
            },
            grid: {
              color: '#e9ecef'
            }
          }
        },
        elements: {
          line: {
            borderWidth: 2
          }
        },
        layout: {
          padding: {
            top: 10,
            bottom: 5,
            left: 5,
            right: 5
          }
        }
      }
    });
  }

  renderEngagementGauge(): void {
    const canvas = document.getElementById('engagementGaugeChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Présents', 'Absents'],
        datasets: [{
          data: [81, 19],
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 0,
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',  // Pour Chart.js v4
        plugins: {
          tooltip: { 
            callbacks: { 
              label: (ctx) => `${ctx.raw}%` 
            } 
          },
          legend: { 
            position: 'bottom'
          }
        }
      }
    });
  }

  renderClubComparison(): void {
    const canvas = document.getElementById('clubComparisonChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Club Robotique', 'Club Culturel', 'Club Sportif', 'Club Artistique'],
        datasets: [
          {
            label: 'Membres',
            data: [47, 32, 28, 35],
            backgroundColor: '#667eea',
            borderRadius: 8
          },
          {
            label: 'Activités',
            data: [24, 18, 15, 20],
            backgroundColor: '#10b981',
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } }
      }
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

  getRiskLevelColor(risk: number): string {
    if (risk < 0.3) return '#10b981';
    if (risk < 0.6) return '#ffc107';
    return '#ef4444';
  }

  getRiskLevelText(risk: number): string {
    if (risk < 0.3) return 'Faible';
    if (risk < 0.6) return 'Modéré';
    return 'Élevé';
  }

  getGrowthIcon(growth: number): string {
    if (growth > 0) return '📈';
    if (growth < 0) return '📉';
    return '📊';
  }

  getGrowthColor(growth: number): string {
    if (growth > 0) return '#10b981';
    if (growth < 0) return '#ef4444';
    return '#ffc107';
  }
}