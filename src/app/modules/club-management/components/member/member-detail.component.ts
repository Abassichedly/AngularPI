import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Membre } from '../../models/membre';
import { Participation } from '../../models/participation';
import { Club } from '../../models/club';
import { ParticipationService } from '../../services/participation.service';
import { ClubService } from '../../services/club.service';
import { NotificationService } from '../../services/notification.service';
import { MembreService } from '../../services/membre.service';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Membre | null = null;
  club: Club | null = null;
  participations: Participation[] = [];
  loading = true;
  activeTab: 'info' | 'participations' = 'info';
  memberId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private membreService: MembreService,
    private clubService: ClubService,
    private participationService: ParticipationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.memberId = +params['id'];
        this.loadMemberDetails();
      }
    });
  }

  loadMemberDetails(): void {
    this.loading = true;
    this.membreService.getById(this.memberId!).subscribe({
      next: (member) => {
        this.member = member;
        if (member.clubId) {
          this.loadClub(member.clubId);
        }
        this.loadParticipations();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger le membre');
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
    this.participationService.getByMembre(this.memberId!).subscribe({
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
    this.router.navigate(['/club-management/members']);
  }

  editMember(): void {
    this.router.navigate(['/club-management/members/edit', this.memberId]);
  }

  deleteMember(): void {
    if (confirm(`Voulez-vous vraiment supprimer le membre "${this.member?.nom} ${this.member?.prenom}" ?`)) {
      this.membreService.deleteMember(this.memberId!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Membre supprimé avec succès');
          this.router.navigate(['/club-management/members']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer le membre');
        }
      });
    }
  }

  viewClub(): void {
    if (this.club) {
      this.router.navigate(['/club-management/clubs/details', this.club.idClub]);
    }
  }

  viewParticipation(participation: Participation): void {
    this.router.navigate(['/club-management/participations/details', participation.idParticipation]);
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

  getTypeIcon(participation: Participation): string {
    if (participation.activiteId) return '🎪';
    if (participation.eventId) return '🎉';
    return '📌';
  }

  getTypeLabel(participation: Participation): string {
    if (participation.activiteId) return 'Activité';
    if (participation.eventId) return 'Événement';
    return 'Participation';
  }

  formatDate(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}