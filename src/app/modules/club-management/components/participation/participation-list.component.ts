import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Participation } from '../../models/participation';
import { Membre } from '../../models/membre';
import { Activite } from '../../models/activite';
import { ParticipationService } from '../../services/participation.service';
import { ActiviteService } from '../../services/activite.service';
import { NotificationService } from '../../services/notification.service';
import { MembreService } from '../../services/membre.service';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-participation-list',
  templateUrl: './participation-list.component.html',
  styleUrls: ['./participation-list.component.css']
})
export class ParticipationListComponent implements OnInit {
  participations: Participation[] = [];
  filteredParticipations: Participation[] = [];
  membres: Membre[] = [];
  activites: Activite[] = [];
  events: Event[] = [];
  loading = false;

  searchTerm = '';
  selectedStatutPresence = '';
  selectedMembreId: number | null = null;
  selectedActiviteId: number | null = null;
  selectedEventId: number | null = null;
  dateStart = '';
  dateEnd = '';

  statutsPresence = [
    { value: 'INSCRIT', label: '📝 Inscrit', icon: '📝' },
    { value: 'PRESENT', label: '✅ Présent', icon: '✅' },
    { value: 'ABSENT', label: '❌ Absent', icon: '❌' },
    { value: 'LISTE_ATTENTE', label: '⏳ Liste d\'attente', icon: '⏳' }
  ];

  constructor(
    private participationService: ParticipationService,
    private membreService: MembreService,
    private activiteService: ActiviteService,
    private eventService: EventService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadParticipations();
    this.loadMembres();
    this.loadActivites();
    this.loadEvents();
  }

  loadParticipations(): void {
    this.loading = true;
    this.participationService.getAll().subscribe({
      next: (data) => {
        this.participations = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger les participations');
        this.loading = false;
      }
    });
  }

  loadMembres(): void {
    this.membreService.getAll().subscribe({
      next: (data) => { this.membres = data; },
      error: () => { console.error('Erreur chargement membres'); }
    });
  }

  loadActivites(): void {
    this.activiteService.getAll().subscribe({
      next: (data) => { this.activites = data; },
      error: () => { console.error('Erreur chargement activités'); }
    });
  }

  loadEvents(): void {
    this.eventService.getAll().subscribe({
      next: (data) => { this.events = data; },
      error: () => { console.error('Erreur chargement événements'); }
    });
  }

  applyFilters(): void {
    this.filteredParticipations = this.participations.filter(p => {
      const membre = p.membre;
      const activite = p.activite;
      const event = p.event;
      
      const matchSearch = (membre?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
                          (membre?.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
                          (activite?.titre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
                          (event?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);
      const matchStatut = !this.selectedStatutPresence || p.statutPresence === this.selectedStatutPresence;
      const matchMembre = !this.selectedMembreId || membre?.idMembre === this.selectedMembreId;
      const matchActivite = !this.selectedActiviteId || activite?.idActivite === this.selectedActiviteId;
      const matchEvent = !this.selectedEventId || event?.idEvent === this.selectedEventId;
      const matchDate = (!this.dateStart || (p.dateInscription && p.dateInscription >= this.dateStart)) &&
                        (!this.dateEnd || (p.dateInscription && p.dateInscription <= this.dateEnd));
      return matchSearch && matchStatut && matchMembre && matchActivite && matchEvent && matchDate;
    });
  }

  onSearchChange(): void { this.applyFilters(); }
  onFilterChange(): void { this.applyFilters(); }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatutPresence = '';
    this.selectedMembreId = null;
    this.selectedActiviteId = null;
    this.selectedEventId = null;
    this.dateStart = '';
    this.dateEnd = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedStatutPresence || this.selectedMembreId || 
              this.selectedActiviteId || this.selectedEventId || this.dateStart || this.dateEnd);
  }

  editParticipation(p: Participation): void {
    this.router.navigate(['/club-management/participations/edit', p.idParticipation]);
  }

  deleteParticipation(p: Participation): void {
    if (confirm(`Voulez-vous vraiment supprimer cette participation ?`)) {
      this.participationService.deleteParticipation(p.idParticipation!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Participation supprimée avec succès');
          this.loadParticipations();
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer la participation');
        }
      });
    }
  }

  createParticipation(): void {
    this.router.navigate(['/club-management/participations/new']);
  }

  viewDetails(p: Participation): void {
    this.router.navigate(['/club-management/participations/details', p.idParticipation]);
  }

  getStatutPresenceClass(statut: string): string {
    const classes: Record<string, string> = {
      'INSCRIT': 'status-registered',
      'PRESENT': 'status-present',
      'ABSENT': 'status-absent',
      'LISTE_ATTENTE': 'status-waiting'
    };
    return classes[statut] || 'status-default';
  }

  getStatutPresenceLabel(statut: string): string {
    const labels: Record<string, string> = {
      'INSCRIT': '📝 Inscrit',
      'PRESENT': '✅ Présent',
      'ABSENT': '❌ Absent',
      'LISTE_ATTENTE': '⏳ Liste d\'attente'
    };
    return labels[statut] || statut;
  }

  formatDate(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  formatTime(time: string | undefined | null): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  formatDateTime(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}