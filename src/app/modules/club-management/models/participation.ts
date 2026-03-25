export interface Participation {
    idParticipation?: number;
    dateInscription?: string;
    statutPresence?: 'INSCRIT' | 'PRESENT' | 'ABSENT' | 'LISTE_ATTENTE';
    role?: string;
    membreId?: number;
    activiteId?: number;
    eventId?: number;
    membreNom?: string;
    activiteTitre?: string;
    eventNom?: string;
  }