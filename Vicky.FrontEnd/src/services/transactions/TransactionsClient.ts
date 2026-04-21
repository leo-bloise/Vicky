import { BaseClient } from "../BaseClient";
import type { ApiErrorHandler } from "../api-error-handler";
import type { 
  GetTransactionsPagedRequest, 
  GetTransactionsPagedResponse
} from "./types";

export interface CreateTransactionRequest {
  amount: number;
  counterpartyId: string;
  transactionDate: string;
}

export interface GetTransactionsRequest {
  startDate: string;
  endDate: string;
}

export interface TransactionResponse {
  id: string;
  amount: number;
  counterpartyId: string;
  transactionDate: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export class TransactionsClient extends BaseClient {
  constructor(baseUrl: string, errorHandler: ApiErrorHandler) {
    super(baseUrl, errorHandler);
  }

  public async create(request: CreateTransactionRequest): Promise<ApiResponse<TransactionResponse>> {
    const response = await this.post(`${this.baseUrl}/transaction`, JSON.stringify(request));

    const data = await this.tryParse(response);

    if (response.status !== 201) {
      this.errorHandler.handle(response, data);
    }

    return data as ApiResponse<TransactionResponse>;
  }

  public async getTransactions(request: GetTransactionsRequest): Promise<ApiResponse<TransactionResponse[]>> {
    const url = new URL(`${this.baseUrl}/transaction`);

    url.searchParams.append('startDate', request.startDate);
    url.searchParams.append('endDate', request.endDate);

    const response = await this.get(url.toString());

    const data = await this.tryParse(response);

    if (response.status !== 200) {
      this.errorHandler.handle(response, data);
    }

    return data as ApiResponse<TransactionResponse[]>;
  }

  public async getPaged(request: GetTransactionsPagedRequest): Promise<GetTransactionsPagedResponse> {
    const url = new URL(`${this.baseUrl}/transaction/paged`);
    
    url.searchParams.append('pageNumber', request.pageNumber.toString());
    url.searchParams.append('pageSize', request.pageSize.toString());
    url.searchParams.append('startDate', request.startDate);
    url.searchParams.append('endDate', request.endDate);

    const response = await this.get(url.toString());

    const data = await this.tryParse(response);

    if (response.status !== 200) {
      this.errorHandler.handle(response, data);
    }

    return data as GetTransactionsPagedResponse;
  }
}
