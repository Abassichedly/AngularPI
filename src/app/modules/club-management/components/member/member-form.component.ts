import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Club } from '../../models/club';
import { ClubService } from '../../services/club.service';
import { NotificationService } from '../../services/notification.service';
import { MembreService } from '../../services/membre.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {
  memberForm: FormGroup;
  isEditMode = false;
  memberId: number | null = null;
  clubs: Club[] = [];
  loading = false;
  submitting = false;

  roles = [
    { value: 'PRESIDENT', label: '👑 Président' },
    { value: 'VICE_PRESIDENT', label: '⭐ Vice-président' },
    { value: 'SECRETAIRE', label: '📝 Secrétaire' },
    { value: 'TRESORIER', label: '💰 Trésorier' },
    { value: 'MEMBRE_SIMPLE', label: '👤 Membre' }
  ];

  constructor(
    private fb: FormBuilder,
    private memberService: MembreService,
    private clubService: ClubService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.memberForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['MEMBRE_SIMPLE'],
      estActif: [true],
      clubId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClubs();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.memberId = +params['id'];
        this.loadMember();
      }
    });
  }

  loadClubs(): void {
    this.clubService.getAll().subscribe({
      next: (data) => { this.clubs = data; },
      error: () => { this.notificationService.error('Erreur', 'Impossible de charger les clubs'); }
    });
  }

  loadMember(): void {
    this.loading = true;
    this.memberService.getById(this.memberId!).subscribe({
      next: (member) => {
        this.memberForm.patchValue({
          ...member,
          clubId: member.clubId
        });
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Impossible de charger le membre');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      this.notificationService.warning('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.submitting = true;
    const memberData = this.memberForm.value;

    if (this.isEditMode && this.memberId) {
      memberData.idMembre = this.memberId;
      this.memberService.update(memberData).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Membre modifié avec succès');
          this.router.navigate(['/club-management/members']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de modifier le membre');
          this.submitting = false;
        }
      });
    } else {
      this.memberService.create(memberData).subscribe({
        next: () => {
          this.notificationService.success('Succès', 'Membre créé avec succès');
          this.router.navigate(['/club-management/members']);
        },
        error: () => {
          this.notificationService.error('Erreur', 'Impossible de créer le membre');
          this.submitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/club-management/members']);
  }

  getFieldError(fieldName: string): string {
    const control = this.memberForm.get(fieldName);
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required']) return 'Ce champ est obligatoire';
      if (control.errors?.['email']) return 'Email invalide';
      if (control.errors?.['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      if (control.errors?.['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
    }
    return '';
  }
}