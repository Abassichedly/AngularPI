import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Club } from '../../models/club';
import { ClubService } from '../../services/club.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.css']
})
export class ClubListComponent implements OnInit {
  clubs: Club[] = [];
  filteredClubs: Club[] = [];
  loading = false;
  
  // Filtres
  searchTerm = '';
  selectedDomaine = '';
  selectedStatut = '';
  dateStart = '';
  dateEnd = '';
  membresMin: number | null = null;
  
  domaines = [
    { value: 'SCIENTIFIQUE', label: '🔬 Scientifique', icon: '🔬' },
    { value: 'CULTUREL', label: '🎭 Culturel', icon: '🎭' },
    { value: 'SPORTIF', label: '⚽ Sportif', icon: '⚽' },
    { value: 'ARTISTIQUE', label: '🎨 Artistique', icon: '🎨' },
    { value: 'HUMANITAIRE', label: '🤝 Humanitaire', icon: '🤝' },
    { value: 'TECHNOLOGIQUE', label: '💻 Technologique', icon: '💻' }
  ];
  
  statuts = [
    { value: 'ACTIF', label: '✅ Actif', icon: '✅' },
    { value: 'EN_ATTENTE', label: '⏳ En attente', icon: '⏳' },
    { value: 'SUSPENDU', label: '⚠️ Suspendu', icon: '⚠️' },
    { value: 'DISSOUS', label: '❌ Dissous', icon: '❌' }
  ];

  constructor(
    private clubService: ClubService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.loading = true;
    this.clubService.getAll().subscribe({
      next: (data) => {
        this.clubs = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger les clubs');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredClubs = this.clubs.filter(club => {
      const matchSearch = club.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          (club.sigle?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
                          (club.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);
      const matchDomaine = !this.selectedDomaine || club.domaine === this.selectedDomaine;
      const matchStatut = !this.selectedStatut || club.statut === this.selectedStatut;
      const matchDate = (!this.dateStart || (club.dateCreation && club.dateCreation >= this.dateStart)) &&
                        (!this.dateEnd || (club.dateCreation && club.dateCreation <= this.dateEnd));
      const matchMembres = !this.membresMin || (club.nbMembresActuels ?? 0) >= this.membresMin;
      return matchSearch && matchDomaine && matchStatut && matchDate && matchMembres;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedDomaine = '';
    this.selectedStatut = '';
    this.dateStart = '';
    this.dateEnd = '';
    this.membresMin = null;
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedDomaine || this.selectedStatut || this.dateStart || this.dateEnd || this.membresMin);
  }

  editClub(club: Club): void {
    this.router.navigate(['/club-management/clubs/edit', club.idClub]);
  }

  deleteClub(club: Club): void {
    if (confirm(`Voulez-vous vraiment supprimer le club "${club.nom}" ?`)) {
      this.clubService.deleteClub(club.idClub!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Club supprimé avec succès');
          this.loadClubs();
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer le club');
        }
      });
    }
  }

  createClub(): void {
    this.router.navigate(['/club-management/clubs/new']);
  }

  viewDetails(club: Club): void {
    this.router.navigate(['/club-management/clubs/details', club.idClub]);
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
  formatDate(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}