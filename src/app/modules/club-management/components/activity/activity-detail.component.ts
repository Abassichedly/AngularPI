import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activite } from '../../models/activite';
import { Participation } from '../../models/participation';
import { ActiviteService } from '../../services/activite.service';
import { ParticipationService } from '../../services/participation.service';
import { NotificationService } from '../../services/notification.service';
import { ClubService } from '../../services/club.service';
import { Club } from '../../models/club';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {
  activity: Activite | null = null;
  club: Club | null = null;
  participants: Participation[] = [];
  loading = true;
  activeTab: 'info' | 'participants' = 'info';
  activityId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private activiteService: ActiviteService,
    private clubService: ClubService,
    private participationService: ParticipationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.activityId = +params['id'];
        this.loadActivityDetails();
      }
    });
  }

  loadActivityDetails(): void {
    this.loading = true;
    this.activiteService.getById(this.activityId!).subscribe({
      next: (activity) => {
        this.activity = activity;
        if (activity.clubId) {
          this.loadClub(activity.clubId);
        }
        this.loadParticipants();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger l\'activité');
        this.loading = false;
      }
    });
  }

  loadClub(clubId: number): void {
    this.clubService.getById(clubId).subscribe({
      next: (club) => { this.club = club; },
      error: () => { console.error('Erreur chargement club'); }
    });
  }

  loadParticipants(): void {
    this.participationService.getByActivite(this.activityId!).subscribe({
      next: (data) => {
        this.participants = data;
        this.loading = false;
      },
      error: () => {
        console.error('Erreur chargement participants');
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: 'info' | 'participants'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/club-management/activities']);
  }

  editActivity(): void {
    this.router.navigate(['/club-management/activities/edit', this.activityId]);
  }

  deleteActivity(): void {
    if (confirm(`Voulez-vous vraiment supprimer l'activité "${this.activity?.titre}" ?`)) {
      this.activiteService.deleteActivite(this.activityId!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Activité supprimée avec succès');
          this.router.navigate(['/club-management/activities']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer l\'activité');
        }
      });
    }
  }

  viewParticipant(memberId: number): void {
    this.router.navigate(['/club-management/members/details', memberId]);
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'REUNION': '📋', 'ATELIER': '🔧', 'FORMATION': '📚',
      'ENTRAINEMENT': '🏃', 'CONFERENCE': '🎤', 'DEBAT': '💬'
    };
    return icons[type] || '📅';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'REUNION': 'Réunion', 'ATELIER': 'Atelier', 'FORMATION': 'Formation',
      'ENTRAINEMENT': 'Entraînement', 'CONFERENCE': 'Conférence', 'DEBAT': 'Débat'
    };
    return labels[type] || type;
  }

  getStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      'PLANIFIEE': 'status-planned', 'EN_COURS': 'status-ongoing',
      'TERMINEE': 'status-completed', 'ANNULEE': 'status-cancelled'
    };
    return classes[statut] || 'status-default';
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'PLANIFIEE': '📅 Planifiée', 'EN_COURS': '🔄 En cours',
      'TERMINEE': '✅ Terminée', 'ANNULEE': '❌ Annulée'
    };
    return labels[statut] || statut;
  }

  getStatutPresenceClass(statut: string): string {
    const classes: Record<string, string> = {
      'INSCRIT': 'status-registered', 'PRESENT': 'status-present',
      'ABSENT': 'status-absent', 'LISTE_ATTENTE': 'status-waiting'
    };
    return classes[statut] || 'status-default';
  }

  getStatutPresenceLabel(statut: string): string {
    const labels: Record<string, string> = {
      'INSCRIT': '📝 Inscrit', 'PRESENT': '✅ Présent',
      'ABSENT': '❌ Absent', 'LISTE_ATTENTE': '⏳ Liste d\'attente'
    };
    return labels[statut] || statut;
  }

  formatDate(date: string): string {
    if (!date) return 'Non défini';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }
}