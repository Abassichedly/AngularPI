import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Membre } from '../models/membre';
import { Interaction } from '../models/interaction';

@Injectable({
  providedIn: 'root'
})
export class SocialService extends ApiService {
  
  getRecommendations(membreId: number): Observable<Membre[]> {
    return this.get<Membre[]>(`/social/recommendations/${membreId}`);
  }

  getInfluenceScore(membreId: number): Observable<any> {
    return this.get(`/social/influence/${membreId}`);
  }

  getCommunities(): Observable<any[]> {
    return this.get<any[]>('/social/communities');
  }

  createInteraction(interaction: Interaction): Observable<Interaction> {
    return this.post<Interaction>('/social/interaction', interaction);
  }

  findMembresByInterest(tag: string): Observable<Membre[]> {
    return this.get<Membre[]>(`/social/interests/${tag}`);
  }
}