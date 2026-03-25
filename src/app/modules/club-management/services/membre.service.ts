import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Membre } from '../models/membre';

@Injectable({
  providedIn: 'root'
})
export class MembreService extends ApiService {
  
  getAll(): Observable<Membre[]> {
    return this.get<Membre[]>('/membre/listMembre');
  }

  getById(id: number): Observable<Membre> {
    return this.get<Membre>(`/membre/getbyid/${id}`);
  }

  create(membre: Membre): Observable<Membre> {
    return this.post<Membre>('/membre/add', membre);
  }

  update(membre: Membre): Observable<Membre> {
    return this.put<Membre>('/membre/update', membre);
  }

  deleteMember(id: number): Observable<void> {
    return this.delete<void>(`/membre/delete/${id}`);
  }

  findByClubId(clubId: number): Observable<Membre[]> {
    return this.get<Membre[]>(`/membre/search/club/${clubId}`);
  }

  getSortedByName(): Observable<Membre[]> {
    return this.get<Membre[]>('/membre/sorted/name');
  }
}