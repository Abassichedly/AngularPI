import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ClubService } from '../../services/club.service';
import { ParticipationService } from '../../services/participation.service';
import { User, UserRole } from '../../models/user';
import { Club } from '../../models/club';
import { Participation } from '../../models/participation';
import { NotificationService } from '../../services/notification.service';
import { ActiviteService } from '../../services/activite.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  club: Club | null = null;
  participations: Participation[] = [];
  loading = true;
  activeTab: 'info' | 'participations' = 'info';
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private userService: UserService,
    private clubService: ClubService,
    private participationService: ParticipationService,
    private activiteService: ActiviteService,
    private eventService: EventService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = params['id'];
        this.loadUserDetails();
      }
    });
  }

  loadUserDetails(): void {
    this.loading = true;
    this.userService.getById(this.userId!).subscribe({
      next: (user) => {
        this.user = user;
        if (user.clubId) {
          this.loadClub(user.clubId);
        }
        this.loadParticipations();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger l\'utilisateur');
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

  loadParticipations(): void {
    this.participationService.getByUserId(this.userId!).subscribe({
      next: (data) => {
        this.participations = data;
        this.loading = false;
      },
      error: () => {
        console.error('Erreur chargement participations');
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: 'info' | 'participations'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/club-management/users']);
  }

  editUser(): void {
    this.router.navigate(['/club-management/users/edit', this.userId]);
  }

  deleteUser(): void {
    if (confirm(`Voulez-vous vraiment supprimer l'utilisateur "${this.user?.firstName} ${this.user?.lastName}" ?`)) {
      this.userService.deleteUser(this.userId!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Utilisateur supprimé avec succès');
          this.router.navigate(['/club-management/users']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer l\'utilisateur');
        }
      });
    }
  }

  viewClub(): void {
    if (this.club) {
      this.router.navigate(['/club-management/clubs/details', this.club.idClub]);
    }
  }

  // FIXED: View participation details using nested objects
  viewParticipation(participation: Participation): void {
    if (participation.activite?.idActivite) {
      this.router.navigate(['/club-management/activities/details', participation.activite.idActivite]);
    } else if (participation.event?.idEvent) {
      this.router.navigate(['/club-management/events/details', participation.event.idEvent]);
    }
  }

  getRoleIcon(role: string): string {
    const icons: Record<string, string> = {
      'SUPER_ADMIN': '👑',
      'ADMIN': '🔧',
      'PRESIDENT': '👨‍💼',
      'VICE_PRESIDENT': '⭐',
      'SECRETAIRE': '📝',
      'TRESORIER': '💰',
      'MEMBRE_SIMPLE': '👤'
    };
    return icons[role] || '👤';
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'SUPER_ADMIN': 'Super Admin',
      'ADMIN': 'Admin',
      'PRESIDENT': 'Président',
      'VICE_PRESIDENT': 'Vice-président',
      'SECRETAIRE': 'Secrétaire',
      'TRESORIER': 'Trésorier',
      'MEMBRE_SIMPLE': 'Membre'
    };
    return labels[role] || role;
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

  // FIXED: Get type icon from nested objects
  getTypeIcon(participation: Participation): string {
    if (participation.activite?.idActivite) return '🎪';
    if (participation.event?.idEvent) return '🎉';
    return '📌';
  }

  // FIXED: Get type label from nested objects
  getTypeLabel(participation: Participation): string {
    if (participation.activite?.idActivite) return 'Activité';
    if (participation.event?.idEvent) return 'Événement';
    return 'Participation';
  }

  // FIXED: Check if participation is for activity
  isActivityParticipation(participation: Participation): boolean {
    return !!participation.activite?.idActivite;
  }

  // FIXED: Check if participation is for event
  isEventParticipation(participation: Participation): boolean {
    return !!participation.event?.idEvent;
  }

  // FIXED: Get activity ID from nested object
  getActiviteId(participation: Participation): number | null {
    return participation.activite?.idActivite || null;
  }

  // FIXED: Get event ID from nested object
  getEventId(participation: Participation): number | null {
    return participation.event?.idEvent || null;
  }

  // FIXED: Get activity title (will be populated from backend or needs separate load)
  getActiviteTitre(participation: Participation): string {
    // If the activity object has the title, use it
    if (participation.activite?.titre) {
      return participation.activite.titre;
    }
    return 'Activité';
  }

  // FIXED: Get event name (will be populated from backend or needs separate load)
  getEventNom(participation: Participation): string {
    // If the event object has the name, use it
    if (participation.event?.nom) {
      return participation.event.nom;
    }
    return 'Événement';
  }

  // FIXED: Get participation title for display
  getParticipationTitle(participation: Participation): string {
    if (this.isActivityParticipation(participation)) {
      return this.getActiviteTitre(participation);
    }
    if (this.isEventParticipation(participation)) {
      return this.getEventNom(participation);
    }
    return 'N/A';
  }

  formatDate(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  formatDateTime(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}