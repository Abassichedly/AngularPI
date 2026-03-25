export interface Club {
    idClub?: number;
    nom: string;
    sigle?: string;
    description?: string;
    domaine?: 'SCIENTIFIQUE' | 'CULTUREL' | 'SPORTIF' | 'ARTISTIQUE' | 'HUMANITAIRE' | 'TECHNOLOGIQUE';
    dateCreation?: string;
    statut?: 'EN_ATTENTE' | 'ACTIF' | 'SUSPENDU' | 'DISSOUS' | 'ARCHIVE';
    logo?: string;
    siteWeb?: string;
    nbMembresMax?: number;
    nbMembresActuels?: number;
  }