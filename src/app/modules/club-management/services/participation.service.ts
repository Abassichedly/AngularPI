import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Participation } from '../models/participation';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService extends ApiService {
  
  getAll(): Observable<Participation[]> {
    return this.get<Participation[]>('/participation/listParticipation');
  }

  getById(id: number): Observable<Participation> {
    return this.get<Participation>(`/participation/getbyid/${id}`);
  }

  create(participation: Participation): Observable<Participation> {
    return this.post<Participation>('/participation/add', participation);
  }

  update(participation: Participation): Observable<Participation> {
    return this.put<Participation>('/participation/update', participation);
  }

  deleteParticipation(id: number): Observable<void> {
    return this.delete<void>(`/participation/delete/${id}`);
  }

  findByMembreId(membreId: number): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/membre/${membreId}`);
  }

  findByActiviteId(activiteId: number): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/activite/${activiteId}`);
  }

  findByEventId(eventId: number): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/event/${eventId}`);
  }
}