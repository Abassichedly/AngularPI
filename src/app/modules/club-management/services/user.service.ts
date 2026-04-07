import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {
  
  // ========== CRUD ==========
  getAll(): Observable<User[]> {
    return this.get<User[]>('/user/listUser');
  }

  getById(id: string): Observable<User> {
    return this.get<User>(`/user/getbyid/${id}`);
  }

  create(user: User): Observable<User> {
    return this.post<User>('/user/add', user);
  }

  update(user: User): Observable<User> {
    if (!user.id) {
      throw new Error('User ID is required for update');
    }
    // Backend expects PUT to /user/update with user object in body
    return this.put<User>('/user/update', user);
  }

  deleteUser(id: string): Observable<void> {
    return this.delete<void>(`/user/delete/${id}`);
  }

  // ========== RECHERCHES SIMPLES ==========
  findByFirstName(firstName: string): Observable<User[]> {
    return this.get<User[]>(`/user/search/firstname/${firstName}`);
  }

  findByLastName(lastName: string): Observable<User[]> {
    return this.get<User[]>(`/user/search/lastname/${lastName}`);
  }

  findByEmail(email: string): Observable<User[]> {
    return this.get<User[]>(`/user/search/email/${email}`);
  }

  findByRole(role: string): Observable<User[]> {
    return this.get<User[]>(`/user/search/role/${role}`);
  }

  findByIsActive(isActive: boolean): Observable<User[]> {
    return this.get<User[]>(`/user/search/actif/${isActive}`);
  }

  findByClubId(clubId: number): Observable<User[]> {
    return this.get<User[]>(`/user/search/club/${clubId}`);
  }

  // ========== RECHERCHE MULTI-CRITÈRES ==========
  searchUsers(firstName?: string, lastName?: string, role?: string): Observable<User[]> {
    return this.get<User[]>('/user/search', { firstName, lastName, role });
  }

  searchAll(params: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    clubId?: number;
    dateStart?: string;
    dateEnd?: string;
  }): Observable<User[]> {
    return this.get<User[]>('/user/search/all', params);
  }

  // ========== TRI ==========
  getSortedByName(): Observable<User[]> {
    return this.get<User[]>('/user/sorted/name');
  }

  getSortedByDate(): Observable<User[]> {
    return this.get<User[]>('/user/sorted/date');
  }

  // ========== SPÉCIFIQUE ==========
  getActifsByClub(clubId: number): Observable<User[]> {
    return this.get<User[]>(`/user/search/club/${clubId}/actifs`);
  }

  getByClubAndRole(clubId: number, role: string): Observable<User[]> {
    return this.get<User[]>(`/user/search/club/${clubId}/role/${role}`);
  }

  getUsersWithAtLeastNParticipations(minParticipations: number): Observable<User[]> {
    return this.get<User[]>(`/user/search/withAtLeast/${minParticipations}`);
  }
}