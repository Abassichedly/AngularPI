import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MentorMatch } from '../models/mentor-match';

@Injectable({
  providedIn: 'root'
})
export class MatchingService extends ApiService {
  
  findBestMentors(userId: string, limit: number = 5): Observable<MentorMatch[]> {
    return this.get<MentorMatch[]>(`/matching/mentors/${userId}?limit=${limit}`);
  }

  findBestMentees(userId: string, limit: number = 5): Observable<MentorMatch[]> {
    return this.get<MentorMatch[]>(`/matching/mentees/${userId}?limit=${limit}`);
  }
}