import { AuthorizationClient } from './AuthorizationClient';
import { CounterpartiesClient } from './counterparties/CounterpartiesClient';
import { TransactionsClient } from './transactions/TransactionsClient';
import { ApiErrorHandler } from './api-error-handler';

export class ClientFactory {
  private baseUrl: string;
  private token: string | null;
  private errorHandler: ApiErrorHandler;

  constructor(baseUrl: string, token: string | null = null) {
    this.baseUrl = baseUrl;
    this.token = token || localStorage.getItem('vickyToken');
    this.errorHandler = new ApiErrorHandler();
  }

  public setToken(token: string | null): void {
    this.token = token;
  }

  public createAuthorizationClient(): AuthorizationClient {
    const client = new AuthorizationClient(this.baseUrl, this.errorHandler);
    if (this.token) {
      client.setToken(this.token);
    }
    return client;
  }

  public createCounterpartiesClient(): CounterpartiesClient {
    const client = new CounterpartiesClient(this.baseUrl, this.errorHandler);
    if (this.token) {
      client.setToken(this.token);
    }
    return client;
  }

  public createTransactionsClient(): TransactionsClient {
    const client = new TransactionsClient(this.baseUrl, this.errorHandler);
    if (this.token) {
      client.setToken(this.token);
    }
    return client;
  }
}
