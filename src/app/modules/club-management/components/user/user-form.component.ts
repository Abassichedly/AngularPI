import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ClubService } from '../../services/club.service';
import { UserRole } from '../../models/user';
import { Club } from '../../models/club';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  clubs: Club[] = [];
  loading = false;
  submitting = false;
  showPasswordFields = false;

  roles = Object.values(UserRole).map(role => ({
    value: role,
    label: this.getRoleLabel(role)
  }));

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private clubService: ClubService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      passwordHash: ['', []], // Initially no validators
      confirmPassword: ['', []],
      department: [''],
      role: [UserRole.MEMBRE_SIMPLE, Validators.required],
      isActive: [true],
      clubId: [null]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('passwordHash')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    // Only validate if password fields are not empty
    if (password || confirmPassword) {
      return password === confirmPassword ? null : { mismatch: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.loadClubs();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = params['id'];
        this.loadUser();
      } else {
        // Create mode: password is required
        this.userForm.get('passwordHash')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
        this.userForm.get('passwordHash')?.updateValueAndValidity();
        this.userForm.get('confirmPassword')?.updateValueAndValidity();
      }
    });
  }

  togglePasswordChange(event: any): void {
    this.showPasswordFields = event.target.checked;
    if (this.showPasswordFields) {
      this.userForm.get('passwordHash')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    } else {
      this.userForm.get('passwordHash')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
      this.userForm.get('passwordHash')?.setValue('');
      this.userForm.get('confirmPassword')?.setValue('');
    }
    this.userForm.get('passwordHash')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
  }

  loadClubs(): void {
    this.clubService.getAll().subscribe({
      next: (data) => { 
        this.clubs = data; 
      },
      error: (error) => { 
        console.error('Error loading clubs:', error);
        this.notificationService.error('Erreur', 'Impossible de charger les clubs'); 
      }
    });
  }

  // In loadUser() method - Keep as is (don't set password)
loadUser(): void {
  this.loading = true;
  this.userService.getById(this.userId!).subscribe({
    next: (user) => {
      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role,
        isActive: user.isActive,
        clubId: user.clubId
        // DON'T set passwordHash - it's not returned from backend
      });
      
      // In edit mode, password is optional
      this.userForm.get('passwordHash')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
      this.userForm.get('passwordHash')?.setValue(''); // Clear password field
      this.userForm.get('confirmPassword')?.setValue(''); // Clear confirm field
      this.userForm.get('passwordHash')?.updateValueAndValidity();
      this.userForm.get('confirmPassword')?.updateValueAndValidity();
      
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading user:', error);
      this.notificationService.error('Erreur', 'Impossible de charger l\'utilisateur');
      this.loading = false;
    }
  });
}

// In onSubmit() method - Only send password if changed
onSubmit(): void {
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    this.notificationService.warning('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires');
    return;
  }

  this.submitting = true;
  const formValue = this.userForm.value;
  
  const userData: any = {
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    email: formValue.email,
    phone: formValue.phone,
    department: formValue.department,
    role: formValue.role,
    isActive: formValue.isActive,
    clubId: formValue.clubId
  };

  if (!this.isEditMode) {
    // Create mode: password is required
    userData.passwordHash = formValue.passwordHash;
    this.userService.create(userData).subscribe({
      next: () => {
        this.notificationService.success('Succès', 'Utilisateur créé avec succès');
        this.router.navigate(['/club-management/users']);
      },
      error: (err) => {
        console.error('Erreur création:', err);
        this.notificationService.error('Erreur', 'Impossible de créer l\'utilisateur');
        this.submitting = false;
      }
    });
  } else {
    // Edit mode: only include password if it was provided AND changed
    if (formValue.passwordHash && formValue.passwordHash.trim() !== '') {
      userData.passwordHash = formValue.passwordHash;
    }
    userData.id = this.userId;
    
    console.log('Updating user with ID:', this.userId);
    console.log('User data (password will be undefined if not changed):', {
      ...userData,
      passwordHash: userData.passwordHash ? '***PRESENT***' : 'NOT CHANGED'
    });
    
    // OPTION A: Try original endpoint (ID in body)
    this.userService.update(userData).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        this.notificationService.success('Succès', 'Utilisateur modifié avec succès');
        this.router.navigate(['/club-management/users']);
      },
      error: (error) => {
        console.error('Erreur mise à jour:', error);
        this.notificationService.error('Erreur', `Impossible de modifier l'utilisateur: ${error.message || 'Erreur serveur'}`);
        this.submitting = false;
      }
    });
  }
}
  goBack(): void {
    this.router.navigate(['/club-management/users']);
  }

  getFieldError(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required']) return 'Ce champ est obligatoire';
      if (control.errors?.['email']) return 'Email invalide';
      if (control.errors?.['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      if (control.errors?.['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
      if (control.errors?.['pattern']) return 'Format invalide (8-15 chiffres)';
      if (control.errors?.['mismatch']) return 'Les mots de passe ne correspondent pas';
    }
    return '';
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
}