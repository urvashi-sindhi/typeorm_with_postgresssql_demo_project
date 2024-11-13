export interface PaginationResult {
  pageSize: number;
  totalRecordsCount: number;
  currentPage: number;
  totalPages: number;
  skip: number;
  limit: number;
}
