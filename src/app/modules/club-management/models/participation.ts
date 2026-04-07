// participation.model.ts
export interface Participation {
  idParticipation?: number;
  dateInscription?: string;
  statutPresence?: string;
  role?: string;
  userId: string;
  activite?: {
    idActivite: number;
    titre?: string;
    date?: string;
    lieu?: string;
  } | null;
  event?: {
    idEvent: number;
    nom?: string;
    dateDebut?: string;
    lieu?: string;
  } | null;
}