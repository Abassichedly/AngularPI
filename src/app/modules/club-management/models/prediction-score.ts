export interface PredictionScore {
    idPrediction?: number;
    type: 'CROISSANCE' | 'POPULARITE' | 'RISQUE_DEPART';
    score: number;
    confiance: number;
    facteurs?: string;
    datePrediction?: string;
    clubId: number;
    clubNom?: string;
  }