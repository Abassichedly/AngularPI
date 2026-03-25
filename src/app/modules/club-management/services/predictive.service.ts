import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PredictiveService extends ApiService {
  
  predictClubEvolution(clubId: number): Observable<any> {
    return this.get(`/predict/club/${clubId}`);
  }

  predictChurnRisk(membreId: number): Observable<any> {
    return this.get(`/predict/churn/${membreId}`);
  }

  getTrends(): Observable<any> {
    return this.get('/predict/trends');
  }

  getClubRanking(): Observable<any[]> {
    return this.get<any[]>('/predict/ranking');
  }

  getPredictionHistory(clubId: number): Observable<any[]> {
    return this.get<any[]>(`/predict/history/${clubId}`);
  }
}