// participation-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipationService } from '../../services/participation.service';
import { UserService } from '../../services/user.service';
import { ActiviteService } from '../../services/activite.service';
import { EventService } from '../../services/event.service';
import { NotificationService } from '../../services/notification.service';
import { Participation } from '../../models/participation';
import { User } from '../../models/user';
import { Activite } from '../../models/activite';
import { Event } from '../../models/event';

@Component({
  selector: 'app-participation-detail',
  templateUrl: './participation-detail.component.html',
  styleUrls: ['./participation-detail.component.css']
})
export class ParticipationDetailComponent implements OnInit {
  participation: Participation | null = null;
  user: User | null = null;  // Changed from 'membre' to 'user'
  activite: Activite | null = null;
  event: Event | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private participationService: ParticipationService,
    private userService: UserService,
    private activiteService: ActiviteService,
    private eventService: EventService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadParticipation(params['id']);
      }
    });
  }

  loadParticipation(id: number): void {
    this.loading = true;
    this.participationService.getById(id).subscribe({
      next: (data) => {
        this.participation = data;
        
        // Load user
        if (data.userId) {
          this.userService.getById(data.userId).subscribe({
            next: (user) => {
              this.user = user;
            },
            error: () => {
              console.error('Error loading user');
            }
          });
        }
        
        // Load activity if exists
        if (data.activite?.idActivite) {
          this.activiteService.getById(data.activite.idActivite).subscribe({
            next: (activite) => {
              this.activite = activite;
            },
            error: () => {
              console.error('Error loading activity');
            }
          });
        }
        
        // Load event if exists
        if (data.event?.idEvent) {
          this.eventService.getById(data.event.idEvent).subscribe({
            next: (event) => {
              this.event = event;
            },
            error: () => {
              console.error('Error loading event');
            }
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading participation:', error);
        this.notificationService.error('Erreur', 'Impossible de charger la participation');
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/club-management/participations']);
  }

  editParticipation(): void {
    this.router.navigate(['/club-management/participations/edit', this.participation?.idParticipation]);
  }

  deleteParticipation(): void {
    if (confirm('Voulez-vous vraiment supprimer cette participation ?')) {
      this.participationService.deleteParticipation(this.participation!.idParticipation!).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Participation supprimée avec succès');
          this.router.navigate(['/club-management/participations']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de supprimer la participation');
        }
      });
    }
  }

  viewUser(): void {  // Changed from viewMember to viewUser
    if (this.user) {
      this.router.navigate(['/club-management/users/details', this.user.id]);
    }
  }

  viewActivity(): void {
    if (this.activite) {
      this.router.navigate(['/club-management/activities/details', this.activite.idActivite]);
    }
  }

  viewEvent(): void {
    if (this.event) {
      this.router.navigate(['/club-management/events/details', this.event.idEvent]);
    }
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

  formatDateTime(date: string | undefined | null): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}