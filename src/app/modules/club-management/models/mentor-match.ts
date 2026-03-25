import { Membre } from "./membre";

export interface MentorMatch {
  mentor: Membre;
  mentore: Membre;
  matchScore: number;
  matchLevel: string;
  commonInterests: string[];
  complementarySkills: string[];
  scoreBreakdown: { [key: string]: number };
  recommendations: string[];
}