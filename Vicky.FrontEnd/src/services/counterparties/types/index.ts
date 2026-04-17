export interface GetCounterpartiesRequest {
  pageNumber: number;
  pageSize: number;
  startDate: string;
  endDate: string;
  name?: string;
}

export interface CounterpartyListItem {
  id: string;
  name: string;
}

export interface GetCounterpartiesResponse {
  data: {
    currentPage: number,
    data: CounterpartyListItem[],
    totalItems: number,
    totalPages: number
  };
  message: string;
  success: boolean;
}