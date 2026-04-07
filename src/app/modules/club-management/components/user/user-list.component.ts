import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, UserRole } from '../../models/user';
import { ClubService } from '../../services/club.service';
import { Club } from '../../models/club';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  clubs: Club[] = [];
  loading = false;
  deletingUser: string | null = null; // Track which user is being deleted
  togglingStatus: string | null = null; // Track which user's status is being toggled

  searchTerm = '';
  selectedRole = '';
  selectedStatut = '';
  selectedClubId: number | null = null;
  dateStart = '';
  dateEnd = '';

  roles = Object.values(UserRole).map(role => ({
    value: role,
    label: this.getRoleLabel(role)
  }));

  constructor(
    private userService: UserService,
    private clubService: ClubService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadClubs();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.notificationService.error('Erreur', 'Impossible de charger les utilisateurs');
        this.loading = false;
      }
    });
  }

  loadClubs(): void {
    this.clubService.getAll().subscribe({
      next: (data) => { 
        this.clubs = data; 
      },
      error: (error) => { 
        console.error('Error loading clubs:', error); 
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchSearch = user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchRole = !this.selectedRole || user.role === this.selectedRole;
      const matchStatut = !this.selectedStatut || user.isActive.toString() === this.selectedStatut;
      const matchClub = !this.selectedClubId || user.clubId === this.selectedClubId;
      const matchDate = (!this.dateStart || (user.dateAdhesion && user.dateAdhesion >= this.dateStart)) &&
                        (!this.dateEnd || (user.dateAdhesion && user.dateAdhesion <= this.dateEnd));
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

  editUser(user: User): void {
    this.router.navigate(['/club-management/users/edit', user.id]);
  }

  // NEW: Toggle user active status without opening edit form
  toggleUserStatus(user: User): void {
    if (!user.id) return;
    
    this.togglingStatus = user.id;
    const updatedUser = { ...user, isActive: !user.isActive };
    
    this.userService.update(updatedUser).subscribe({
      next: () => {
        // Update the user in the local arrays
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index].isActive = !user.isActive;
        }
        this.applyFilters(); // Refresh filtered list
        
        const status = updatedUser.isActive ? 'activé' : 'désactivé';
        this.notificationService.success('Succès', `Utilisateur ${status} avec succès`);
        this.togglingStatus = null;
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        this.notificationService.error('Erreur', 'Impossible de modifier le statut de l\'utilisateur');
        this.togglingStatus = null;
      }
    });
  }

  deleteUser(user: User): void {
    if (!user.id) return;
    
    if (confirm(`Voulez-vous vraiment supprimer l'utilisateur "${user.firstName} ${user.lastName}" ? Cette action est irréversible.`)) {
      this.deletingUser = user.id;
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Utilisateur supprimé avec succès');
          this.loadUsers(); // Reload the list
          this.deletingUser = null;
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.notificationService.error('Erreur', 'Impossible de supprimer l\'utilisateur');
          this.deletingUser = null;
        }
      });
    }
  }

  createUser(): void {
    this.router.navigate(['/club-management/users/new']);
  }

  viewDetails(user: User): void {
    this.router.navigate(['/club-management/users/details', user.id]);
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'SUPER_ADMIN': '👑 Super Admin',
      'ADMIN': '🔧 Admin',
      'PRESIDENT': '👨‍💼 Président',
      'VICE_PRESIDENT': '⭐ Vice-président',
      'SECRETAIRE': '📝 Secrétaire',
      'TRESORIER': '💰 Trésorier',
      'MEMBRE_SIMPLE': '👤 Membre'
    };
    return labels[role] || role;
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

  formatDate(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  // Helper method to get club name by ID
  getClubName(clubId: number | null | undefined): string {
    if (!clubId) return 'Aucun club';
    const club = this.clubs.find(c => c.idClub === clubId);
    return club ? club.nom : 'Club inconnu';
  }
}