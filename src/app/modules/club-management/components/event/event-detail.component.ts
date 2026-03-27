import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Club } from '../../models/club';
import { Event } from '../../models/event';
import { ClubService } from '../../services/club.service';
import { ParticipationService } from '../../services/participation.service';
import { EventService } from '../../services/event.service';
import { Participation } from '../../models/participation';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  club: Club | null = null;
  participants: Participation[] = [];
  loading = true;
  activeTab: 'info' | 'participants' | 'program' = 'info';
  eventId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private eventService: EventService,
    private clubService: ClubService,
    private participationService: ParticipationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.eventId = +params['id'];
        this.loadEventDetails();
      }
    });
  }

  loadEventDetails(): void {
    this.loading = true;
    this.eventService.getById(this.eventId!).subscribe({
      next: (event) => {
        this.event = event;
        if (event.clubId) {
          this.loadClub(event.clubId);
        }
        this.loadParticipants();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger l\'événement');
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
    this.participationService.getByEvent(this.eventId!).subscribe({
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

  setActiveTab(tab: 'info' | 'participants' | 'program'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/club-management/events']);
  }

  editEvent(): void {
    this.router.navigate(['/club-management/events/edit', this.eventId]);
  }

  deleteEvent(): void {
    if (confirm(`Voulez-vous vraiment supprimer l'événement "${this.event?.nom}" ?`)) {
      this.eventService.deleteEvent(this.eventId!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Événement supprimé avec succès');
          this.router.navigate(['/club-management/events']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer l\'événement');
        }
      });
    }
  }

  viewParticipant(memberId: number): void {
    this.router.navigate(['/club-management/members/details', memberId]);
  }

  getTauxRemplissage(): number {
    const max = this.event?.capacite || 0;
    if (max === 0) return 0;
    return Math.round((this.participants.length / max) * 100);
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

  formatDateTime(date: string): string {
    if (!date) return 'Non défini';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}