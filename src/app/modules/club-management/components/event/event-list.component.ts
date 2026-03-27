import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';
import { Club } from '../../models/club';
import { ClubService } from '../../services/club.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  clubs: Club[] = [];
  loading = false;

  searchTerm = '';
  selectedStatut = '';
  selectedClubId: number | null = null;
  dateStart = '';
  dateEnd = '';
  prixMax: number | null = null;

  statuts = [
    { value: 'EN_PREPARATION', label: '🔧 En préparation', icon: '🔧' },
    { value: 'PUBLIE', label: '📢 Publié', icon: '📢' },
    { value: 'COMPLET', label: '🔴 Complet', icon: '🔴' },
    { value: 'EN_COURS', label: '🔄 En cours', icon: '🔄' },
    { value: 'TERMINE', label: '✅ Terminé', icon: '✅' },
    { value: 'ANNULE', label: '❌ Annulé', icon: '❌' }
  ];

  constructor(
    private eventService: EventService,
    private clubService: ClubService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadClubs();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger les événements');
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
    this.filteredEvents = this.events.filter(event => {
      const matchSearch = event.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          (event.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
                          (event.lieu?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);
      const matchStatut = !this.selectedStatut || event.statut === this.selectedStatut;
      const matchClub = !this.selectedClubId || event.clubId === this.selectedClubId;
      const matchDate = (!this.dateStart || (event.dateDebut && event.dateDebut >= this.dateStart)) &&
                        (!this.dateEnd || (event.dateDebut && event.dateDebut <= this.dateEnd));
      const matchPrix = !this.prixMax || (event.prixAdherent ?? 0) <= this.prixMax;
      return matchSearch && matchStatut && matchClub && matchDate && matchPrix;
    });
  }

  onSearchChange(): void { this.applyFilters(); }
  onFilterChange(): void { this.applyFilters(); }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatut = '';
    this.selectedClubId = null;
    this.dateStart = '';
    this.dateEnd = '';
    this.prixMax = null;
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedStatut || this.selectedClubId || this.dateStart || this.dateEnd || this.prixMax);
  }

  editEvent(event: Event): void {
    this.router.navigate(['/club-management/events/edit', event.idEvent]);
  }

  deleteEvent(event: Event): void {
    if (confirm(`Voulez-vous vraiment supprimer l'événement "${event.nom}" ?`)) {
      this.eventService.deleteEvent(event.idEvent!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Événement supprimé avec succès');
          this.loadEvents();
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer l\'événement');
        }
      });
    }
  }

  createEvent(): void {
    this.router.navigate(['/club-management/events/new']);
  }

  viewDetails(event: Event): void {
    this.router.navigate(['/club-management/events/details', event.idEvent]);
  }

  getStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      'EN_PREPARATION': 'status-preparation', 'PUBLIE': 'status-published',
      'COMPLET': 'status-full', 'EN_COURS': 'status-ongoing',
      'TERMINE': 'status-completed', 'ANNULE': 'status-cancelled'
    };
    return classes[statut] || 'status-default';
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'EN_PREPARATION': '🔧 En préparation', 'PUBLIE': '📢 Publié',
      'COMPLET': '🔴 Complet', 'EN_COURS': '🔄 En cours',
      'TERMINE': '✅ Terminé', 'ANNULE': '❌ Annulé'
    };
    return labels[statut] || statut;
  }

  formatDateTime(date: string): string {
    if (!date) return 'Non défini';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getPlacesDisponibles(event: Event): number {
    return (event.capacite || 0) - (event.nbParticipants || 0);
  }
}