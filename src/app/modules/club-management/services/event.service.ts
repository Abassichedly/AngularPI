import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService extends ApiService {
  
  getAll(): Observable<Event[]> {
    return this.get<Event[]>('/event/listEvent');
  }

  getById(id: number): Observable<Event> {
    return this.get<Event>(`/event/getbyid/${id}`);
  }

  create(event: Event): Observable<Event> {
    return this.post<Event>('/event/add', event);
  }

  update(event: Event): Observable<Event> {
    return this.put<Event>('/event/update', event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.delete<void>(`/event/delete/${id}`);
  }

  findByClubId(clubId: number): Observable<Event[]> {
    return this.get<Event[]>(`/event/search/club/${clubId}`);
  }

  getUpcoming(): Observable<Event[]> {
    return this.get<Event[]>('/event/search/upcoming');
  }

  getSortedByDate(): Observable<Event[]> {
    return this.get<Event[]>('/event/sorted/date');
  }
}