// participation-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Participation } from '../../models/participation';
import { Activite } from '../../models/activite';
import { ParticipationService } from '../../services/participation.service';
import { ActiviteService } from '../../services/activite.service';
import { NotificationService } from '../../services/notification.service';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-participation-list',
  templateUrl: './participation-list.component.html',
  styleUrls: ['./participation-list.component.css']
})
export class ParticipationListComponent implements OnInit {
  participations: Participation[] = [];
  filteredParticipations: Participation[] = [];
  users: User[] = [];
  activites: Activite[] = [];
  events: Event[] = [];
  loading = false;

  searchTerm = '';
  selectedStatutPresence = '';
  selectedUserId: string | null = null;
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
    private userService: UserService,
    private activiteService: ActiviteService,
    private eventService: EventService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading = true;
    
    // Load all data in parallel
    Promise.all([
      this.participationService.getAll().toPromise(),
      this.userService.getAll().toPromise(),
      this.activiteService.getAll().toPromise(),
      this.eventService.getAll().toPromise()
    ]).then(([participations, users, activites, events]) => {
      this.participations = participations || [];
      this.users = users || [];
      this.activites = activites || [];
      this.events = events || [];
      
      console.log('Participations loaded:', this.participations.length);
      console.log('First participation:', this.participations[0]);
      
      this.applyFilters();
      this.loading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.notificationService.error('Erreur', 'Impossible de charger les données');
      this.loading = false;
    });
  }

  applyFilters(): void {
    this.filteredParticipations = this.participations.filter(p => {
      const user = this.users.find(u => u.id === p.userId);
      const activite = p.activite ? this.activites.find(a => a.idActivite === p.activite?.idActivite) : null;
      const event = p.event ? this.events.find(e => e.idEvent === p.event?.idEvent) : null;
      
      const matchSearch = !this.searchTerm || 
        (user?.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false) ||
        (user?.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false) ||
        (activite?.titre?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false) ||
        (event?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false);
      
      const matchStatut = !this.selectedStatutPresence || p.statutPresence === this.selectedStatutPresence;
      const matchUser = !this.selectedUserId || p.userId === this.selectedUserId;
      const matchActivite = !this.selectedActiviteId || (p.activite?.idActivite === this.selectedActiviteId);
      const matchEvent = !this.selectedEventId || (p.event?.idEvent === this.selectedEventId);
      const matchDate = (!this.dateStart || (p.dateInscription && p.dateInscription >= this.dateStart)) &&
                        (!this.dateEnd || (p.dateInscription && p.dateInscription <= this.dateEnd));
      
      return matchSearch && matchStatut && matchUser && matchActivite && matchEvent && matchDate;
    });
  }

  onSearchChange(): void { this.applyFilters(); }
  onFilterChange(): void { this.applyFilters(); }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatutPresence = '';
    this.selectedUserId = null;
    this.selectedActiviteId = null;
    this.selectedEventId = null;
    this.dateStart = '';
    this.dateEnd = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedStatutPresence || this.selectedUserId || 
              this.selectedActiviteId || this.selectedEventId || this.dateStart || this.dateEnd);
  }

  editParticipation(p: Participation): void {
    this.router.navigate(['/club-management/participations/edit', p.idParticipation]);
  }

  deleteParticipation(p: Participation): void {
    if (confirm('Voulez-vous vraiment supprimer cette participation ?')) {
      this.participationService.deleteParticipation(p.idParticipation!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Participation supprimée');
          this.loadAllData();
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer');
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

  getTypeIcon(p: Participation): string {
    if (p.activite?.idActivite) return '🎪';
    if (p.event?.idEvent) return '🎉';
    return '📌';
  }

  getUserName(p: Participation): string {
    const user = this.users.find(u => u.id === p.userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu';
  }

  getActiviteTitre(p: Participation): string {
    if (p.activite?.idActivite) {
      const activite = this.activites.find(a => a.idActivite === p.activite?.idActivite);
      return activite?.titre || 'Activité';
    }
    return 'N/A';
  }

  getEventNom(p: Participation): string {
    if (p.event?.idEvent) {
      const event = this.events.find(e => e.idEvent === p.event?.idEvent);
      return event?.nom || 'Événement';
    }
    return 'N/A';
  }

  isActivityParticipation(p: Participation): boolean {
    return !!p.activite?.idActivite;
  }

  isEventParticipation(p: Participation): boolean {
    return !!p.event?.idEvent;
  }

  formatDate(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR');
  }


}