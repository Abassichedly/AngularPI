export interface Activite {
    idActivite?: number;
    titre: string;
    type?: 'REUNION' | 'ATELIER' | 'FORMATION' | 'ENTRAINEMENT' | 'CONFERENCE' | 'DEBAT';
    date?: string;
    heureDebut?: string;
    heureFin?: string;
    lieu?: string;
    nbParticipantsMax?: number;
    description?: string;
    statut?: 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
    clubId?: number;
    clubNom?: string;
    nbParticipantsInscrits?: number;
  }