// participation-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipationService } from '../../services/participation.service';
import { UserService } from '../../services/user.service';
import { ActiviteService } from '../../services/activite.service';
import { EventService } from '../../services/event.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-participation-form',
  templateUrl: './participation-form.component.html',
  styleUrls: ['./participation-form.component.css']
})
export class ParticipationFormComponent implements OnInit {
  participationForm: FormGroup;
  users: any[] = [];
  activities: any[] = [];
  events: any[] = [];
  selectedType: 'activity' | 'event' = 'activity';
  submitting = false;
  isEditMode = false;
  participationId: number | null = null;

  statutsPresence = [
    { value: 'INSCRIT', label: '📝 Inscrit' },
    { value: 'PRESENT', label: '✅ Présent' },
    { value: 'ABSENT', label: '❌ Absent' },
    { value: 'LISTE_ATTENTE', label: '⏳ Liste d\'attente' }
  ];

  roles = [
    { value: 'PARTICIPANT', label: 'Participant' },
    { value: 'INTERVENANT', label: 'Intervenant' },
    { value: 'ORGANISATEUR', label: 'Organisateur' },
    { value: 'BENEVOLE', label: 'Bénévole' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private participationService: ParticipationService,
    private userService: UserService,
    private activiteService: ActiviteService,
    private eventService: EventService,
    private notificationService: NotificationService
  ) {
    this.participationForm = this.fb.group({
      userId: ['', Validators.required],
      type: ['activity', Validators.required],
      activiteId: [null],
      eventId: [null],
      statutPresence: ['INSCRIT'],
      role: ['PARTICIPANT']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadActivities();
    this.loadEvents();
    
    // Check if editing
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.participationId = params['id'];
        this.loadParticipation();
      }
    });
    
    // Listen to type changes
    this.participationForm.get('type')?.valueChanges.subscribe(type => {
      this.selectedType = type;
      if (type === 'activity') {
        this.participationForm.get('activiteId')?.setValidators(Validators.required);
        this.participationForm.get('eventId')?.clearValidators();
        this.participationForm.get('eventId')?.setValue(null);
      } else {
        this.participationForm.get('eventId')?.setValidators(Validators.required);
        this.participationForm.get('activiteId')?.clearValidators();
        this.participationForm.get('activiteId')?.setValue(null);
      }
      this.participationForm.get('activiteId')?.updateValueAndValidity();
      this.participationForm.get('eventId')?.updateValueAndValidity();
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => { this.users = data; },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  loadActivities(): void {
    this.activiteService.getAll().subscribe({
      next: (data) => { this.activities = data; },
      error: (err) => console.error('Error loading activities:', err)
    });
  }

  loadEvents(): void {
    this.eventService.getAll().subscribe({
      next: (data) => { this.events = data; },
      error: (err) => console.error('Error loading events:', err)
    });
  }

  loadParticipation(): void {
    this.participationService.getById(this.participationId!).subscribe({
      next: (data) => {
        console.log('Loading participation for edit:', data);
        
        // Set user
        this.participationForm.patchValue({
          userId: data.userId,
          statutPresence: data.statutPresence,
          role: data.role
        });
        
        // Check if it's activity or event
        if (data.activite && data.activite.idActivite) {
          this.selectedType = 'activity';
          this.participationForm.patchValue({
            type: 'activity',
            activiteId: data.activite.idActivite
          });
        } else if (data.event && data.event.idEvent) {
          this.selectedType = 'event';
          this.participationForm.patchValue({
            type: 'event',
            eventId: data.event.idEvent
          });
        }
        
        // Trigger validation
        this.participationForm.get('type')?.updateValueAndValidity();
      },
      error: (error) => {
        console.error('Error loading participation:', error);
        this.notificationService.error('Erreur', 'Impossible de charger la participation');
        this.router.navigate(['/club-management/participations']);
      }
    });
  }

  onSubmit(): void {
    if (this.participationForm.invalid) {
      this.notificationService.warning('Formulaire incomplet', 'Veuillez remplir tous les champs requis');
      return;
    }

    this.submitting = true;
    const formValue = this.participationForm.value;
    
    // Build participation object
    const participationData: any = {
      userId: formValue.userId,
      statutPresence: formValue.statutPresence,
      role: formValue.role,
      dateInscription: new Date().toISOString().split('T')[0]
    };
    
    // Add activity or event
    if (formValue.type === 'activity' && formValue.activiteId) {
      participationData.activite = { idActivite: Number(formValue.activiteId) };
    } else if (formValue.type === 'event' && formValue.eventId) {
      participationData.event = { idEvent: Number(formValue.eventId) };
    }
    
    console.log('Saving participation:', participationData);
    
    if (this.isEditMode) {
      participationData.idParticipation = this.participationId;
      this.participationService.updateParticipation(participationData).subscribe({
        next: (response) => {
          console.log('Participation updated:', response);
          this.notificationService.success('Succès', 'Participation modifiée avec succès');
          this.router.navigate(['/club-management/participations']);
        },
        error: (error) => {
          console.error('Error updating:', error);
          this.notificationService.error('Erreur', 'Impossible de modifier la participation');
          this.submitting = false;
        }
      });
    } else {
      this.participationService.addParticipation(participationData).subscribe({
        next: (response) => {
          console.log('Participation added:', response);
          this.notificationService.success('Succès', 'Participation ajoutée avec succès');
          this.router.navigate(['/club-management/participations']);
        },
        error: (error) => {
          console.error('Error adding:', error);
          this.notificationService.error('Erreur', 'Impossible d\'ajouter la participation');
          this.submitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/club-management/participations']);
  }

  getUserName(user: any): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  getActivityTitle(activity: any): string {
    if (!activity) return '';
    const date = activity.date ? new Date(activity.date).toLocaleDateString('fr-FR') : '';
    return `${activity.titre} - ${date} (${activity.lieu || 'Lieu non défini'})`;
  }

  getEventName(event: any): string {
    if (!event) return '';
    const date = event.dateDebut ? new Date(event.dateDebut).toLocaleDateString('fr-FR') : '';
    return `${event.nom} - ${date} (${event.lieu || 'Lieu non défini'})`;
  }
}