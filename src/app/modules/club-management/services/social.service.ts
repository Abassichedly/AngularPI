import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Interaction } from '../models/interaction';

@Injectable({
  providedIn: 'root'
})
export class SocialService extends ApiService {
  
  getRecommendations(userId: string): Observable<any[]> {
    return this.get<any[]>(`/social/recommendations/${userId}`);
  }

  getInfluenceScore(userId: string): Observable<any> {
    return this.get(`/social/influence/${userId}`);
  }

  getCommunities(): Observable<any[]> {
    return this.get<any[]>('/social/communities');
  }

  createInteraction(interaction: Interaction): Observable<Interaction> {
    return this.postWithParams<Interaction>('/social/interaction', null, {
      params: {
        sourceId: interaction.userSourceId,
        cibleId: interaction.userCibleId,
        type: interaction.type,
        contenu: interaction.contenu || ''
      }
    });
  }

  findUsersByInterest(tag: string): Observable<any[]> {
    return this.get<any[]>(`/social/interests/${tag}`);
  }
}