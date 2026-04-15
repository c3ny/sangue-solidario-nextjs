export interface IInstitutionCard {
  id: string;
  slug: string;
  institutionName: string;
  type?: string;
  logoImage?: string;
  city?: string;
  uf?: string;
  acceptsDonations?: boolean;
  acceptsScheduling?: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedInstitutionCards {
  data: IInstitutionCard[];
  meta: PaginationMeta;
}
