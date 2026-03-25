export interface Interaction {
    idInteraction?: number;
    type: 'LIKE' | 'COMMENT' | 'COLLABORATION' | 'MENTION';
    contenu?: string;
    dateInteraction?: string;
    poids?: number;
    membreSourceId: number;
    membreCibleId: number;
    membreSourceNom?: string;
    membreCibleNom?: string;
  }