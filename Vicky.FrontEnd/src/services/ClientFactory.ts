import { AuthorizationClient } from './AuthorizationClient';
import { CounterpartiesClient } from './counterparties/CounterpartiesClient';
import { TransactionsClient } from './transactions/TransactionsClient';
import { ReportClient } from './reports/ReportClient';
import { ApiErrorHandler } from './api-error-handler';

export class ClientFactory {
  private baseUrl: string;
  private errorHandler: ApiErrorHandler;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.errorHandler = new ApiErrorHandler();
  }

  public createAuthorizationClient(): AuthorizationClient {
    const client = new AuthorizationClient(this.baseUrl, this.errorHandler);
    return client;
  }

  public createCounterpartiesClient(): CounterpartiesClient {
    const client = new CounterpartiesClient(this.baseUrl, this.errorHandler);
    return client;
  }

  public createTransactionsClient(): TransactionsClient {
    const client = new TransactionsClient(this.baseUrl, this.errorHandler);
    return client;
  }

  public createReportClient(): ReportClient {
    const client = new ReportClient(this.baseUrl, this.errorHandler);
    return client;
  }
}
