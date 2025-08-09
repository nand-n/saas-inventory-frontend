export interface BaseEntity {
    id: string;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
    createdByUser: string | null;
    updatedBy: string | null;
  }


  export interface FilterOptions {
  search?: string;
  status?: string;
  department?: string;
  position?: string;
  role?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc'
}