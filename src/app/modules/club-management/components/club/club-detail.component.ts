import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activite } from '../../models/activite';
import { Membre } from '../../models/membre';
import { MembreService } from '../../services/membre.service';
import { ClubService } from '../../services/club.service';
import { ActiviteService } from '../../services/activite.service';
import { EventService } from '../../services/event.service';
import { NotificationService } from '../../services/notification.service';
import { Club } from '../../models/club';
import { Event } from '../../models/event';
 

@Component({
  selector: 'app-club-detail',
  templateUrl: './club-detail.component.html',
  styleUrls: ['./club-detail.component.css']
})
export class ClubDetailComponent implements OnInit {
  club: Club | null = null;
  members: Membre[] = [];
  activities: Activite[] = [];
  events: Event[] = [];
  loading = true;
  activeTab: 'members' | 'activities' | 'events' = 'members';
  clubId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,  // ← Changé en public
    private clubService: ClubService,
    private membreService: MembreService,
    private activiteService: ActiviteService,
    private eventService: EventService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clubId = +params['id'];
        this.loadClubDetails();
      }
    });
  }

  loadClubDetails(): void {
    this.loading = true;
    this.clubService.getById(this.clubId!).subscribe({
      next: (club) => {
        this.club = club;
        this.loadMembers();
        this.loadActivities();
        this.loadEvents();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger le club');
        this.loading = false;
      }
    });
  }

  loadMembers(): void {
    this.membreService.getByClub(this.clubId!).subscribe({
      next: (data) => {
        this.members = data;
        this.loading = false;
      },
      error: () => {
        console.error('Erreur chargement membres');
        this.loading = false;
      }
    });
  }

  loadActivities(): void {
    this.activiteService.getByClub(this.clubId!).subscribe({
      next: (data) => { this.activities = data; },
      error: () => { console.error('Erreur chargement activités'); }
    });
  }

  loadEvents(): void {
    this.eventService.getByClub(this.clubId!).subscribe({
      next: (data) => { this.events = data; },
      error: () => { console.error('Erreur chargement événements'); }
    });
  }

  setActiveTab(tab: 'members' | 'activities' | 'events'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/club-management/clubs']);
  }

  editClub(): void {
    this.router.navigate(['/club-management/clubs/edit', this.clubId]);
  }

  deleteClub(): void {
    if (confirm(`Voulez-vous vraiment supprimer le club "${this.club?.nom}" ?`)) {
      this.clubService.deleteClub(this.clubId!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Club supprimé avec succès');
          this.router.navigate(['/club-management/clubs']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer le club');
        }
      });
    }
  }

  viewMember(memberId: number): void {
    this.router.navigate(['/club-management/members/details', memberId]);
  }

  viewActivity(activityId: number): void {
    this.router.navigate(['/club-management/activities/details', activityId]);
  }

  viewEvent(eventId: number): void {
    this.router.navigate(['/club-management/events/details', eventId]);
  }

  getDomaineIcon(domaine: string): string {
    const icons: Record<string, string> = {
      'SCIENTIFIQUE': '🔬', 'CULTUREL': '🎭', 'SPORTIF': '⚽',
      'ARTISTIQUE': '🎨', 'HUMANITAIRE': '🤝', 'TECHNOLOGIQUE': '💻'
    };
    return icons[domaine] || '🏛️';
  }

  getStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      'ACTIF': 'status-active', 'EN_ATTENTE': 'status-pending',
      'SUSPENDU': 'status-suspended', 'DISSOUS': 'status-dissolved'
    };
    return classes[statut] || 'status-default';
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'ACTIF': '✅ Actif', 'EN_ATTENTE': '⏳ En attente',
      'SUSPENDU': '⚠️ Suspendu', 'DISSOUS': '❌ Dissous'
    };
    return labels[statut] || statut;
  }

  getRoleIcon(role: string): string {
    const icons: Record<string, string> = {
      'PRESIDENT': '👑', 'VICE_PRESIDENT': '⭐', 'SECRETAIRE': '📝',
      'TRESORIER': '💰', 'MEMBRE_SIMPLE': '👤'
    };
    return icons[role] || '👤';
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'PRESIDENT': 'Président', 'VICE_PRESIDENT': 'Vice-président',
      'SECRETAIRE': 'Secrétaire', 'TRESORIER': 'Trésorier', 'MEMBRE_SIMPLE': 'Membre'
    };
    return labels[role] || role;
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

  getEventStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      'EN_PREPARATION': 'status-preparation', 'PUBLIE': 'status-published',
      'COMPLET': 'status-full', 'EN_COURS': 'status-ongoing',
      'TERMINE': 'status-completed', 'ANNULE': 'status-cancelled'
    };
    return classes[statut] || 'status-default';
  }

  getEventStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'EN_PREPARATION': '🔧 En préparation', 'PUBLIE': '📢 Publié',
      'COMPLET': '🔴 Complet', 'EN_COURS': '🔄 En cours',
      'TERMINE': '✅ Terminé', 'ANNULE': '❌ Annulé'
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

  formatDateTime(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
}