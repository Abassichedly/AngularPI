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
  
  // Pour les objets imbriqués du backend
  membre?: {
    idMembre: number;
    nom: string;
    prenom: string;
    email: string;
    role?: string;
  };
  activite?: {
    idActivite: number;
    titre: string;
    type?: string;
    date?: string;
    heureDebut?: string;
    lieu?: string;
  };
  event?: {
    idEvent: number;
    nom: string;
    dateDebut?: string;
    lieu?: string;
  };
}