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


  // participation.service.ts - REMOVE the data transformation
addParticipation(participation: any): Observable<Participation> {
  // Don't transform the data again! Just send it as is
  console.log('Service sending:', JSON.stringify(participation, null, 2));
  return this.post<Participation>('/participation/add', participation);
}

updateParticipation(participation: any): Observable<Participation> {
  console.log('Updating participation:', participation);
  return this.put<Participation>('/participation/update', participation);
}

  deleteParticipation(id: number): Observable<void> {
    return this.delete<void>(`/participation/delete/${id}`);
  }

  getByUserId(userId: string): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/user/${userId}`);
  }

  getByActiviteId(activiteId: number): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/activite/${activiteId}`);
  }

  getByEventId(eventId: number): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/event/${eventId}`);
  }

  searchParticipations(userId?: string, statutPresence?: string): Observable<Participation[]> {
    return this.get<Participation[]>('/participation/search', { userId, statutPresence });
  }

  searchAll(params: {
    userId?: string;
    activiteId?: number;
    eventId?: number;
    statutPresence?: string;
    dateStart?: string;
    dateEnd?: string;
  }): Observable<Participation[]> {
    return this.get<Participation[]>('/participation/search/all', params);
  }

  getByUserIdAndActiviteId(userId: string, activiteId: number): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/user/${userId}/activite/${activiteId}`);
  }

  getByUserIdAndEventId(userId: string, eventId: number): Observable<Participation[]> {
    return this.get<Participation[]>(`/participation/search/user/${userId}/event/${eventId}`);
  }

  countPresencesByActiviteId(activiteId: number): Observable<number> {
    return this.get<number>(`/participation/stats/activite/${activiteId}/presences`);
  }

  countPresencesByEventId(eventId: number): Observable<number> {
    return this.get<number>(`/participation/stats/event/${eventId}/presences`);
  }
}