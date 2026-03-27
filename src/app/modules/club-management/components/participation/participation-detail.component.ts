import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Participation } from '../../models/participation';
import { Event } from '../../models/event';
import { Membre } from '../../models/membre';
import { ParticipationService } from '../../services/participation.service';
import { EventService } from '../../services/event.service';
import { ActiviteService } from '../../services/activite.service';
import { Activite } from '../../models/activite';
import { NotificationService } from '../../services/notification.service';
import { MembreService } from '../../services/membre.service';

 

@Component({
  selector: 'app-participation-detail',
  templateUrl: './participation-detail.component.html',
  styleUrls: ['./participation-detail.component.css']
})
export class ParticipationDetailComponent implements OnInit {
  participation: Participation | null = null;
  membre: Membre | null = null;
  activite: Activite | null = null;
  event: Event | null = null;
  loading = true;
  participationId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private participationService: ParticipationService,
    private membreService: MembreService,
    private activiteService: ActiviteService,
    private eventService: EventService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.participationId = +params['id'];
        this.loadParticipationDetails();
      }
    });
  }

  loadParticipationDetails(): void {
    this.loading = true;
    this.participationService.getById(this.participationId!).subscribe({
      next: (participation) => {
        this.participation = participation;
        this.loadRelatedData();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger la participation');
        this.loading = false;
      }
    });
  }

  loadRelatedData(): void {
    if (this.participation?.membre) {
      this.membre = this.participation.membre as Membre;
    }
    
    if (this.participation?.activite) {
      this.activite = this.participation.activite as Activite;
    }
    
    if (this.participation?.event) {
      this.event = this.participation.event as Event;
    }
    
    this.loading = false;
  }

  goBack(): void {
    this.router.navigate(['/club-management/participations']);
  }

  editParticipation(): void {
    this.router.navigate(['/club-management/participations/edit', this.participationId]);
  }

  deleteParticipation(): void {
    if (confirm(`Voulez-vous vraiment supprimer cette participation ?`)) {
      this.participationService.deleteParticipation(this.participationId!).subscribe({
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

  viewMember(): void {
    if (this.membre) {
      this.router.navigate(['/club-management/members/details', this.membre.idMembre]);
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