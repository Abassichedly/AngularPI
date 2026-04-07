export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash?: string;
  phone: string;
  department?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  totalLoginCount?: number;
  preferredLanguage?: string;
  isTwoFactorEnabled?: boolean;
  googleId?: string;
  linkedInId?: string;
  scheduledDeletionAt?: string;
  dateAdhesion?: string;
  clubId?: number;
  clubNom?: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PRESIDENT = 'PRESIDENT',
  VICE_PRESIDENT = 'VICE_PRESIDENT',
  SECRETAIRE = 'SECRETAIRE',
  TRESORIER = 'TRESORIER',
  MEMBRE_SIMPLE = 'MEMBRE_SIMPLE'
}