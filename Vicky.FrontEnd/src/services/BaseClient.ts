import { ApiErrorHandler } from "./api-error-handler";

export abstract class BaseClient {
    protected readonly baseUrl: string;
    protected headers: HeadersInit;
    protected token: string | null = null;
    protected errorHandler: ApiErrorHandler;

    constructor(baseUrl: string, errorHandler?: ApiErrorHandler) {
        this.baseUrl = baseUrl;
        this.errorHandler = errorHandler || new ApiErrorHandler();
        this.headers = this.createDefaultHeaders();
        this.token = localStorage.getItem('vickyToken');
    }

    protected createDefaultHeaders(): HeadersInit {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        if (this.token) {
            headers.append('Authorization', `Bearer ${this.token}`);
        }

        return headers;
    }

    protected updateAuthHeader(): void {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        if (this.token) {
            headers.append('Authorization', `Bearer ${this.token}`);
        }

        this.headers = headers;
    }

    public setToken(token: string) {
        this.token = token;
        this.headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    protected async tryParse(response: Response): Promise<unknown | string> {
        try {
            return response.json();
        } catch (err: unknown) {
            return response.text();
        }
    }

}