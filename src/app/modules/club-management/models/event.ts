export interface Event {
    idEvent?: number;
    nom: string;
    dateDebut?: string;
    dateFin?: string;
    lieu?: string;
    capacite?: number;
    prixAdherent?: number;
    prixNonAdherent?: number;
    description?: string;
    programme?: string;
    statut?: 'EN_PREPARATION' | 'PUBLIE' | 'COMPLET' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
    clubId?: number;
    clubNom?: string;
    placesDisponibles?: number;
    nbParticipants?: number;
  }