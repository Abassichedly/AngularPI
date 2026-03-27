import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { MembreService } from '../../services/membre.service';
import { Membre } from '../../models/membre';
import { Club } from '../../models/club';
import { ClubService } from '../../services/club.service';
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Membre[] = [];
  filteredMembers: Membre[] = [];
  clubs: Club[] = [];
  loading = false;

  searchTerm = '';
  selectedRole = '';
  selectedStatut = '';
  selectedClubId: number | null = null;
  dateStart = '';
  dateEnd = '';

  roles = [
    { value: 'PRESIDENT', label: '👑 Président', icon: '👑' },
    { value: 'VICE_PRESIDENT', label: '⭐ Vice-président', icon: '⭐' },
    { value: 'SECRETAIRE', label: '📝 Secrétaire', icon: '📝' },
    { value: 'TRESORIER', label: '💰 Trésorier', icon: '💰' },
    { value: 'MEMBRE_SIMPLE', label: '👤 Membre', icon: '👤' }
  ];

  statuts = [
    { value: 'true', label: '✅ Actif', icon: '✅' },
    { value: 'false', label: '❌ Inactif', icon: '❌' }
  ];

  constructor(
    private membreService: MembreService,
    private clubService: ClubService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadMembers();
    this.loadClubs();
  }

  loadMembers(): void {
    this.loading = true;
    this.membreService.getAll().subscribe({
      next: (data) => {
        this.members = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger les membres');
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
    this.filteredMembers = this.members.filter(member => {
      const matchSearch = member.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          member.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchRole = !this.selectedRole || member.role === this.selectedRole;
      const matchStatut = !this.selectedStatut || member.estActif?.toString() === this.selectedStatut;
      const matchClub = !this.selectedClubId || member.clubId === this.selectedClubId;
      const matchDate = (!this.dateStart || (member.dateAdhesion && member.dateAdhesion >= this.dateStart)) &&
                        (!this.dateEnd || (member.dateAdhesion && member.dateAdhesion <= this.dateEnd));
      return matchSearch && matchRole && matchStatut && matchClub && matchDate;
    });
  }

  onSearchChange(): void { this.applyFilters(); }
  onFilterChange(): void { this.applyFilters(); }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatut = '';
    this.selectedClubId = null;
    this.dateStart = '';
    this.dateEnd = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedRole || this.selectedStatut || this.selectedClubId || this.dateStart || this.dateEnd);
  }

  viewDetails(member: Membre): void {
    this.router.navigate(['/club-management/members/details', member.idMembre]);
  }

  editMember(member: Membre): void {
    this.router.navigate(['/club-management/members/edit', member.idMembre]);
  }

  deleteMember(member: Membre): void {
    if (confirm(`Voulez-vous vraiment supprimer le membre "${member.nom} ${member.prenom}" ?`)) {
      this.membreService.deleteMember(member.idMembre!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Membre supprimé avec succès');
          this.loadMembers();
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer le membre');
        }
      });
    }
  }

  createMember(): void {
    this.router.navigate(['/club-management/members/new']);
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
  formatDate(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}