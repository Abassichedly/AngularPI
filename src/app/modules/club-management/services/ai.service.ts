import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivitySuggestion } from '../models/activity-suggestion';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AIService extends ApiService {
  
  generateActivitySuggestions(clubId: number): Observable<ActivitySuggestion[]> {
    return this.get<ActivitySuggestion[]>(`/ai/activities/suggest/${clubId}`);
  }
}