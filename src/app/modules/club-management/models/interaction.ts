export interface Interaction {
  idInteraction?: number;
  type: 'LIKE' | 'COMMENT' | 'COLLABORATION' | 'MENTION';
  contenu?: string;
  dateInteraction?: string;
  poids?: number;
  userSourceId: string;
  userCibleId: string;
  userSourceNom?: string;
  userCibleNom?: string;
}