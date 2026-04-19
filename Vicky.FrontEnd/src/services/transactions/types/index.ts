import type { SuccessResponse } from "../../responses/success-response";

export interface GetTransactionsPagedRequest {
  pageNumber: number;
  pageSize: number;
  startDate: string;
  endDate: string;
}

export interface TransactionListItem {
  id: string;
  amount: number;
  counterpartyId: string;
  transactionDate: string;
}

export interface PagedResult<T> {
  currentPage: number;
  data: T[];
  totalItems: number;
  totalPages: number;
}

export type GetTransactionsPagedResponse = SuccessResponse<PagedResult<TransactionListItem>>;
