export interface GetCounterpartiesRequest {
  pageNumber: number;
  pageSize: number;
  startDate: string;
  endDate: string;
}

export interface CounterpartyListItem {
  id: string;
  name: string;
}

export interface GetCounterpartiesResponse {
  data: CounterpartyListItem[];
  message: string;
  success: boolean;
}