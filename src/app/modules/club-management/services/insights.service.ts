import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InsightsService extends ApiService {
  
  getHeatmap(): Observable<any> {
    return this.get('/insights/heatmap');
  }

  getClubHealth(clubId: number): Observable<any> {
    return this.get(`/insights/club/${clubId}/health`);
  }

  compareClubs(): Observable<any[]> {
    return this.get<any[]>('/insights/compare');
  }

  getTopInterests(): Observable<any[]> {
    return this.get<any[]>('/insights/interests/top');
  }
}