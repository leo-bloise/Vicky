import type { SuccessResponse } from "../../responses/success-response";

export interface GetCounterpartiesRequest {
  pageNumber: number;
  pageSize: number;
  startDate: string;
  endDate: string;
  name?: string;
}

export interface GetCounterpartiesByCursorRequest {
  limit?: number;
  continuationToken?: string;
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

export interface GetCounterpartiesByCursorResponseData {
  continuationToken: string | null;
  data: CounterpartyListItem[];
}

export type GetCounterpartiesByCursorResponse = SuccessResponse<GetCounterpartiesByCursorResponseData>;