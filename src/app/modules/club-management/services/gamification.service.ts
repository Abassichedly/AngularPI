import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GamificationService extends ApiService {
  
  getLeaderboard(): Observable<any[]> {
    return this.get<any[]>('/gamification/leaderboard');
  }

  getPersonalizedJourney(userId: string): Observable<any> {
    return this.get(`/gamification/journey/${userId}`);
  }

  getUserStats(userId: string): Observable<any> {
    return this.get(`/gamification/stats/${userId}`);
  }
}