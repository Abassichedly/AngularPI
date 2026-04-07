import { User } from './user';

export interface MentorMatch {
  mentor: User;
  mentore: User;
  matchScore: number;
  matchLevel: string;
  commonInterests: string[];
  complementarySkills: string[];
  scoreBreakdown: { [key: string]: number };
  recommendations: string[];
}