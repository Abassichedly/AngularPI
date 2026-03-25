import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Activite } from '../models/activite';

@Injectable({
  providedIn: 'root'
})
export class ActiviteService extends ApiService {
  
  getAll(): Observable<Activite[]> {
    return this.get<Activite[]>('/activite/listActivite');
  }

  getById(id: number): Observable<Activite> {
    return this.get<Activite>(`/activite/getbyid/${id}`);
  }

  create(activite: Activite): Observable<Activite> {
    return this.post<Activite>('/activite/add', activite);
  }

  update(activite: Activite): Observable<Activite> {
    return this.put<Activite>('/activite/update', activite);
  }

  deleteActivite(id: number): Observable<void> {
    return this.delete<void>(`/activite/delete/${id}`);
  }

  findByClubId(clubId: number): Observable<Activite[]> {
    return this.get<Activite[]>(`/activite/search/club/${clubId}`);
  }

  getSortedByDate(): Observable<Activite[]> {
    return this.get<Activite[]>('/activite/sorted/date');
  }
}