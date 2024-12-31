export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  data_per_page: number;
  total_page: number;
  total_data: number;
}