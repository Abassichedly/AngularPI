import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Club } from '../../models/club';
import { EventService } from '../../services/event.service';
import { NotificationService } from '../../services/notification.service';
import { ClubService } from '../../services/club.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId: number | null = null;
  clubs: Club[] = [];
  loading = false;
  submitting = false;

  statuts = [
    { value: 'EN_PREPARATION', label: '🔧 En préparation' },
    { value: 'PUBLIE', label: '📢 Publié' },
    { value: 'COMPLET', label: '🔴 Complet' },
    { value: 'EN_COURS', label: '🔄 En cours' },
    { value: 'TERMINE', label: '✅ Terminé' },
    { value: 'ANNULE', label: '❌ Annulé' }
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private clubService: ClubService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.eventForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      lieu: ['', [Validators.required, Validators.maxLength(200)]],
      capacite: [50, [Validators.min(1), Validators.max(1000)]],
      prixAdherent: [0, [Validators.min(0)]],
      prixNonAdherent: [0, [Validators.min(0)]],
      description: ['', [Validators.maxLength(2000)]],
      programme: ['', [Validators.maxLength(2000)]],
      statut: ['EN_PREPARATION'],
      clubId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClubs();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.eventId = +params['id'];
        this.loadEvent();
      }
    });
  }

  loadClubs(): void {
    this.clubService.getAll().subscribe({
      next: (data) => { this.clubs = data; },
      error: () => { this.notificationService.error('Erreur', 'Impossible de charger les clubs'); }
    });
  }

  loadEvent(): void {
    this.loading = true;
    this.eventService.getById(this.eventId!).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          ...event,
          clubId: event.clubId
        });
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger l\'événement');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.notificationService.warning('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.submitting = true;
    const eventData = this.eventForm.value;

    if (this.isEditMode && this.eventId) {
      eventData.idEvent = this.eventId;
      this.eventService.update(eventData).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Événement modifié avec succès');
          this.router.navigate(['/club-management/events']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de modifier l\'événement');
          this.submitting = false;
        }
      });
    } else {
      this.eventService.create(eventData).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Événement créé avec succès');
          this.router.navigate(['/club-management/events']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de créer l\'événement');
          this.submitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/club-management/events']);
  }

  getFieldError(fieldName: string): string {
    const control = this.eventForm.get(fieldName);
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required']) return 'Ce champ est obligatoire';
      if (control.errors?.['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      if (control.errors?.['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
      if (control.errors?.['min']) return `Minimum ${control.errors['min'].min}`;
      if (control.errors?.['max']) return `Maximum ${control.errors['max'].max}`;
    }
    return '';
  }
}