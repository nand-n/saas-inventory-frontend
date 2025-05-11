export interface BaseEntity {
    id: string;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
    createdByUser: string | null;
    updatedBy: string | null;
  }