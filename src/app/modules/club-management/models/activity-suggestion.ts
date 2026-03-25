export interface ActivitySuggestion {
    titre: string;
    type: string;
    description: string;
    lieuSuggere: string;
    heureSuggeree: string;
    dureeEstimee: number;
    participantsEstimes: number;
    scoreConfiance: number;
    tags: string[];
    motsCles: string[];
    raison: string;
    dateSuggestion: string;
  }