import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activite } from '../../models/activite';
import { Club } from '../../models/club';
import { ActiviteService } from '../../services/activite.service';
import { NotificationService } from '../../services/notification.service';
import { ClubService } from '../../services/club.service';


@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  activities: Activite[] = [];
  filteredActivities: Activite[] = [];
  clubs: Club[] = [];
  loading = false;

  searchTerm = '';
  selectedType = '';
  selectedStatut = '';
  selectedClubId: number | null = null;
  dateStart = '';
  dateEnd = '';

  types = [
    { value: 'REUNION', label: '📋 Réunion' },
    { value: 'ATELIER', label: '🔧 Atelier' },
    { value: 'FORMATION', label: '📚 Formation' },
    { value: 'ENTRAINEMENT', label: '🏃 Entraînement' },
    { value: 'CONFERENCE', label: '🎤 Conférence' },
    { value: 'DEBAT', label: '💬 Débat' }
  ];

  statuts = [
    { value: 'PLANIFIEE', label: '📅 Planifiée' },
    { value: 'EN_COURS', label: '🔄 En cours' },
    { value: 'TERMINEE', label: '✅ Terminée' },
    { value: 'ANNULEE', label: '❌ Annulée' }
  ];

  constructor(
    private activiteService: ActiviteService,
    private clubService: ClubService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadActivities();
    this.loadClubs();
  }

  loadActivities(): void {
    this.loading = true;
    this.activiteService.getAll().subscribe({
      next: (data) => {
        this.activities = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger les activités');
        this.loading = false;
      }
    });
  }

  loadClubs(): void {
    this.clubService.getAll().subscribe({
      next: (data) => { this.clubs = data; },
      error: () => { console.error('Erreur chargement clubs'); }
    });
  }

  applyFilters(): void {
    this.filteredActivities = this.activities.filter(activity => {
      const matchSearch = activity.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          (activity.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);
      const matchType = !this.selectedType || activity.type === this.selectedType;
      const matchStatut = !this.selectedStatut || activity.statut === this.selectedStatut;
      const matchClub = !this.selectedClubId || activity.clubId === this.selectedClubId;
      const matchDate = (!this.dateStart || (activity.date && activity.date >= this.dateStart)) &&
                        (!this.dateEnd || (activity.date && activity.date <= this.dateEnd));
      return matchSearch && matchType && matchStatut && matchClub && matchDate;
    });
  }

  onSearchChange(): void { this.applyFilters(); }
  onFilterChange(): void { this.applyFilters(); }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedStatut = '';
    this.selectedClubId = null;
    this.dateStart = '';
    this.dateEnd = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedType || this.selectedStatut || this.selectedClubId || this.dateStart || this.dateEnd);
  }

  editActivity(activity: Activite): void {
    this.router.navigate(['/club-management/activities/edit', activity.idActivite]);
  }

  deleteActivity(activity: Activite): void {
    if (confirm(`Voulez-vous vraiment supprimer l'activité "${activity.titre}" ?`)) {
      this.activiteService.deleteActivite(activity.idActivite!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Activité supprimée avec succès');
          this.loadActivities();
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer l\'activité');
        }
      });
    }
  }

  createActivity(): void {
    this.router.navigate(['/club-management/activities/new']);
  }

  viewDetails(activity: Activite): void {
    this.router.navigate(['/club-management/activities/details', activity.idActivite]);
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

  formatDate(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }
}