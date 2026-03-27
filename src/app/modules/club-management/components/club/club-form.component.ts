import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClubService } from '../../services/club.service';
import { NotificationService } from '../../services/notification.service';
import { Club } from '../../models/club';
@Component({
  selector: 'app-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnInit {
  clubForm: FormGroup;
  isEditMode = false;
  clubId: number | null = null;
  loading = false;
  submitting = false;

  domaines = [
    { value: 'SCIENTIFIQUE', label: '🔬 Scientifique', icon: '🔬' },
    { value: 'CULTUREL', label: '🎭 Culturel', icon: '🎭' },
    { value: 'SPORTIF', label: '⚽ Sportif', icon: '⚽' },
    { value: 'ARTISTIQUE', label: '🎨 Artistique', icon: '🎨' },
    { value: 'HUMANITAIRE', label: '🤝 Humanitaire', icon: '🤝' },
    { value: 'TECHNOLOGIQUE', label: '💻 Technologique', icon: '💻' }
  ];

  statuts = [
    { value: 'EN_ATTENTE', label: '⏳ En attente', class: 'status-pending' },
    { value: 'ACTIF', label: '✅ Actif', class: 'status-active' },
    { value: 'SUSPENDU', label: '⚠️ Suspendu', class: 'status-suspended' },
    { value: 'DISSOUS', label: '❌ Dissous', class: 'status-dissolved' }
  ];

  constructor(
    private fb: FormBuilder,
    private clubService: ClubService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.clubForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      sigle: ['', [Validators.maxLength(20)]],
      description: ['', [Validators.maxLength(2000)]],
      domaine: ['', Validators.required],
      statut: ['EN_ATTENTE'],
      logo: [''],
      siteWeb: ['', [Validators.pattern('https?://.+')]],
      nbMembresMax: [50, [Validators.min(1), Validators.max(500)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clubId = +params['id'];
        this.loadClub();
      }
    });
  }

  loadClub(): void {
    this.loading = true;
    this.clubService.getById(this.clubId!).subscribe({
      next: (club) => {
        this.clubForm.patchValue(club);
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger le club');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.clubForm.invalid) {
      this.clubForm.markAllAsTouched();
      this.notificationService.warning('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.submitting = true;
    const clubData: Club = this.clubForm.value;

    if (this.isEditMode && this.clubId) {
      clubData.idClub = this.clubId;
      this.clubService.update(clubData).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Club modifié avec succès');
          this.router.navigate(['/club-management/clubs']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de modifier le club');
          this.submitting = false;
        }
      });
    } else {
      this.clubService.create(clubData).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Club créé avec succès');
          this.router.navigate(['/club-management/clubs']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de créer le club');
          this.submitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/club-management/clubs']);
  }

  getFieldError(fieldName: string): string {
    const control = this.clubForm.get(fieldName);
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required']) return 'Ce champ est obligatoire';
      if (control.errors?.['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      if (control.errors?.['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
      if (control.errors?.['pattern']) return 'Format invalide (ex: https://...)';
      if (control.errors?.['min']) return `Minimum ${control.errors['min'].min}`;
      if (control.errors?.['max']) return `Maximum ${control.errors['max'].max}`;
    }
    return '';
  }
}