export interface Membre {
    idMembre?: number;
    nom: string;
    prenom: string;
    email: string;
    role?: 'PRESIDENT' | 'VICE_PRESIDENT' | 'SECRETAIRE' | 'TRESORIER' | 'MEMBRE_SIMPLE';
    dateAdhesion?: string;
    estActif?: boolean;
    clubId?: number;
    clubNom?: string;
  }