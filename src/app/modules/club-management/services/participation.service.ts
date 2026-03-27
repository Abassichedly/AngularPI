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

  create(participation: any): Observable<Participation> {
    return this.post<Participation>('/participation/add', participation);
  }

  update(participation: any): Observable<Participation> {
    return this.put<Participation>('/participation/update', participation);
  }

  deleteParticipation(id: number): Observable<void> {
    return this.delete<void>(`/participation/delete/${id}`);
  }

  getByMembre(membreId: number): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/membre/${membreId}`);
  }

  getByActivite(activiteId: number): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/activite/${activiteId}`);
  }

  getByEvent(eventId: number): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/event/${eventId}`);
  }
}