export interface PaginatedResult<T> {
  data: T[];
  metadata: PaginationMetadata;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
