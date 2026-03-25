import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MentorMatch } from '../models/mentor-match';

@Injectable({
  providedIn: 'root'
})
export class MatchingService extends ApiService {
  
  findBestMentors(membreId: number, limit: number = 5): Observable<MentorMatch[]> {
    return this.get<MentorMatch[]>(`/matching/mentors/${membreId}`, { limit });
  }

  findBestMentees(mentorId: number, limit: number = 5): Observable<MentorMatch[]> {
    return this.get<MentorMatch[]>(`/matching/mentees/${mentorId}`, { limit });
  }
}