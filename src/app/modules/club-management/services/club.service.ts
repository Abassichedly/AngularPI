import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Club } from '../models/club';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ClubService extends ApiService {
  
  getAll(): Observable<Club[]> {
    return this.get<Club[]>('/club/listClub');
  }

  getById(id: number): Observable<Club> {
    return this.get<Club>(`/club/getbyid/${id}`);
  }

  create(club: Club): Observable<Club> {
    return this.post<Club>('/club/add', club);
  }

  update(club: Club): Observable<Club> {
    return this.put<Club>('/club/update', club);
  }

  deleteClub(id: number): Observable<void> {
    return super.delete<void>(`/club/delete/${id}`);
  }

  searchClubs(nom?: string, domaine?: string, statut?: string): Observable<Club[]> {
    return this.get<Club[]>('/club/search', { nom, domaine, statut });
  }

  getSortedByName(): Observable<Club[]> {
    return this.get<Club[]>('/club/sorted/name');
  }

  getSortedByDate(): Observable<Club[]> {
    return this.get<Club[]>('/club/sorted/date');
  }
}