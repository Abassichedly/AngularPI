import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activite } from '../../models/activite';
import { ParticipationService } from '../../services/participation.service';
import { ActiviteService } from '../../services/activite.service';
import { EventService } from '../../services/event.service';
import { NotificationService } from '../../services/notification.service';
import { MembreService } from '../../services/membre.service';
import { Membre } from '../../models/membre';
import { Event } from '../../models/event';


@Component({
  selector: 'app-participation-form',
  templateUrl: './participation-form.component.html',
  styleUrls: ['./participation-form.component.css']
})
export class ParticipationFormComponent implements OnInit {
  participationForm: FormGroup;
  isEditMode = false;
  participationId: number | null = null;
  membres: Membre[] = [];
  activites: Activite[] = [];
  events: Event[] = [];
  loading = false;
  submitting = false;
  participationType: 'activite' | 'event' = 'activite';

  statutsPresence = [
    { value: 'INSCRIT', label: '📝 Inscrit' },
    { value: 'PRESENT', label: '✅ Présent' },
    { value: 'ABSENT', label: '❌ Absent' },
    { value: 'LISTE_ATTENTE', label: '⏳ Liste d\'attente' }
  ];

  constructor(
    private fb: FormBuilder,
    private participationService: ParticipationService,
    private membreService: MembreService,
    private activiteService: ActiviteService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.participationForm = this.fb.group({
      membreId: [null, Validators.required],
      type: ['activite', Validators.required],
      activiteId: [null],
      eventId: [null],
      statutPresence: ['INSCRIT', Validators.required],
      role: ['']
    });
  }

  ngOnInit(): void {
    this.loadMembres();
    this.loadActivites();
    this.loadEvents();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.participationId = +params['id'];
        this.loadParticipation();
      }
    });

    this.participationForm.get('type')?.valueChanges.subscribe(value => {
      this.participationType = value;
      if (value === 'activite') {
        this.participationForm.get('eventId')?.setValue(null);
      } else {
        this.participationForm.get('activiteId')?.setValue(null);
      }
    });
  }

  loadMembres(): void {
    this.membreService.getAll().subscribe({
      next: (data) => { this.membres = data; },
      error: () => { this.notificationService.error('Erreur', 'Impossible de charger les membres'); }
    });
  }

  loadActivites(): void {
    this.activiteService.getAll().subscribe({
      next: (data) => { this.activites = data; },
      error: () => { console.error('Erreur chargement activités'); }
    });
  }

  loadEvents(): void {
    this.eventService.getAll().subscribe({
      next: (data) => { this.events = data; },
      error: () => { console.error('Erreur chargement événements'); }
    });
  }

  loadParticipation(): void {
    this.loading = true;
    this.participationService.getById(this.participationId!).subscribe({
      next: (participation) => {
        console.log('Participation chargée:', participation);
        
        // Déterminer le type
        const type = participation.activite ? 'activite' : 'event';
        const activiteId = participation.activite?.idActivite || null;
        const eventId = participation.event?.idEvent || null;
        
        this.participationForm.patchValue({
          membreId: participation.membre?.idMembre || participation.membreId,
          type: type,
          activiteId: activiteId,
          eventId: eventId,
          statutPresence: participation.statutPresence || 'INSCRIT',
          role: participation.role || ''
        });
        
        this.participationType = type;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement participation:', err);
        this.notificationService.error('Erreur', 'Impossible de charger la participation');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.participationForm.invalid) {
      this.participationForm.markAllAsTouched();
      this.notificationService.warning('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.submitting = true;
    const formValue = this.participationForm.value;
    
    const participationData: any = {
      membre: { idMembre: formValue.membreId },
      statutPresence: formValue.statutPresence,
      role: formValue.role
    };

    if (formValue.type === 'activite') {
      participationData.activite = { idActivite: formValue.activiteId };
    } else {
      participationData.event = { idEvent: formValue.eventId };
    }

    if (this.isEditMode && this.participationId) {
      participationData.idParticipation = this.participationId;
      this.participationService.update(participationData).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Participation modifiée avec succès');
          this.router.navigate(['/club-management/participations']);
        },
        error: (err) => {
          console.error('Erreur modification:', err);
          this.notificationService.error('Erreur', 'Impossible de modifier la participation');
          this.submitting = false;
        }
      });
    } else {
      this.participationService.create(participationData).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Participation créée avec succès');
          this.router.navigate(['/club-management/participations']);
        },
        error: (err) => {
          console.error('Erreur création:', err);
          this.notificationService.error('Erreur', 'Impossible de créer la participation');
          this.submitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/club-management/participations']);
  }

  getFieldError(fieldName: string): string {
    const control = this.participationForm.get(fieldName);
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required']) return 'Ce champ est obligatoire';
    }
    return '';
  }

  formatDate(date: string | undefined | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  formatDateTime(date: string | undefined | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}