import { ApiErrorHandler } from "./api-error-handler";

export abstract class BaseClient {
    protected readonly baseUrl: string;
    protected headers: HeadersInit;
    protected errorHandler: ApiErrorHandler;

    constructor(baseUrl: string, errorHandler?: ApiErrorHandler) {
        this.baseUrl = baseUrl;
        this.errorHandler = errorHandler || new ApiErrorHandler();
        this.headers = this.createDefaultHeaders();
    }

    protected createDefaultHeaders(): HeadersInit {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return headers;
    }

    protected async tryParse(response: Response): Promise<unknown | string> {
        try {
            return response.json();
        } catch (err: unknown) {
            return response.text();
        }
    }

    protected buildBaseRequest(): RequestInit {
        return {
            headers: this.createDefaultHeaders(),
            credentials: 'include'
        };
    }

    protected get(url: string, requestInit: RequestInit = {}) {
        return fetch(url, {
            ...this.buildBaseRequest(),
            ...requestInit
        })
    }
    
    protected post(url: string, body: string, request: RequestInit = {}) {
        return fetch(url, {
            ...request,
            ...this.buildBaseRequest(),
            method: 'POST',
            body
        })
    }
}