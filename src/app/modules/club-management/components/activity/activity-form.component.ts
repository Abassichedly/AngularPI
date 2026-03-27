import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Club } from '../../models/club';
import { ActiviteService } from '../../services/activite.service';
import { NotificationService } from '../../services/notification.service';
import { ClubService } from '../../services/club.service';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {
  activityForm: FormGroup;
  isEditMode = false;
  activityId: number | null = null;
  clubs: Club[] = [];
  loading = false;
  submitting = false;

  types = [
    { value: 'REUNION', label: '📋 Réunion' },
    { value: 'ATELIER', label: '🔧 Atelier' },
    { value: 'FORMATION', label: '📚 Formation' },
    { value: 'ENTRAINEMENT', label: '🏃 Entraînement' },
    { value: 'CONFERENCE', label: '🎤 Conférence' },
    { value: 'DEBAT', label: '💬 Débat' }
  ];

  statuts = [
    { value: 'PLANIFIEE', label: '📅 Planifiée' },
    { value: 'EN_COURS', label: '🔄 En cours' },
    { value: 'TERMINEE', label: '✅ Terminée' },
    { value: 'ANNULEE', label: '❌ Annulée' }
  ];

  constructor(
    private fb: FormBuilder,
    private activityService: ActiviteService,
    private clubService: ClubService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.activityForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: ['', Validators.required],
      date: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      lieu: ['', [Validators.required, Validators.maxLength(200)]],
      nbParticipantsMax: [20, [Validators.min(1), Validators.max(200)]],
      description: ['', [Validators.maxLength(2000)]],
      statut: ['PLANIFIEE'],
      clubId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClubs();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.activityId = +params['id'];
        this.loadActivity();
      }
    });
  }

  loadClubs(): void {
    this.clubService.getAll().subscribe({
      next: (data) => { this.clubs = data; },
      error: () => { this.notificationService.error('Erreur', 'Impossible de charger les clubs'); }
    });
  }

  loadActivity(): void {
    this.loading = true;
    this.activityService.getById(this.activityId!).subscribe({
      next: (activity) => {
        this.activityForm.patchValue({
          ...activity,
          clubId: activity.clubId,
          date: activity.date
        });
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger l\'activité');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      this.notificationService.warning('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.submitting = true;
    const activityData = this.activityForm.value;

    if (this.isEditMode && this.activityId) {
      activityData.idActivite = this.activityId;
      this.activityService.update(activityData).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Activité modifiée avec succès');
          this.router.navigate(['/club-management/activities']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de modifier l\'activité');
          this.submitting = false;
        }
      });
    } else {
      this.activityService.create(activityData).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Activité créée avec succès');
          this.router.navigate(['/club-management/activities']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de créer l\'activité');
          this.submitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/club-management/activities']);
  }

  getFieldError(fieldName: string): string {
    const control = this.activityForm.get(fieldName);
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