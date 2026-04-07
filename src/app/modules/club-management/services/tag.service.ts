import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MembreTag } from '../models/membre-tag';

@Injectable({
  providedIn: 'root'
})
export class TagService extends ApiService {
  
  addTagToUser(userId: string, tag: string, poids?: number): Observable<MembreTag> {
    return this.postWithParams<MembreTag>('/tags/add', null, {
      params: { userId, tag, poids: poids?.toString() || '5' }
    });
  }

  addTagsToUser(userId: string, tags: string[]): Observable<MembreTag[]> {
    return this.post<MembreTag[]>('/tags/add-multiple', { userId, tags });
  }

  getUsersByTag(tag: string): Observable<any[]> {
    return this.get<any[]>(`/tags/users/${tag}`);
  }

  getTagsByUser(userId: string): Observable<string[]> {
    return this.get<string[]>(`/tags/user/${userId}`);
  }

  getTopTags(limit: number = 10): Observable<any[]> {
    return this.get<any[]>(`/tags/top?limit=${limit}`);
  }

  removeTagFromUser(userId: string, tag: string): Observable<void> {
    return this.delete<void>(`/tags/remove?userId=${userId}&tag=${tag}`);
  }

  recommendTags(userId: string): Observable<string[]> {
    return this.get<string[]>(`/tags/recommend/${userId}`);
  }
}