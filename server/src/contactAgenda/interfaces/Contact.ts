export interface Contact {
    id: string;
    name: string;
    primaryPhone: string;
    mobilePhone?: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
  }
  