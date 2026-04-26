import { ApiErrorHandler } from "./api-error-handler";
import type { SuccessResponse } from "./responses/success-response";

export abstract class BaseClient {
    protected readonly baseUrl: string;
    protected headers: HeadersInit;
    protected errorHandler: ApiErrorHandler;

    constructor(baseUrl: string, errorHandler?: ApiErrorHandler) {
        this.baseUrl = baseUrl;
        this.errorHandler = errorHandler || new ApiErrorHandler();
        this.headers = this.createDefaultHeaders();
    }

    protected async getCsrfToken(): Promise<string> {
        const response = await this.post(`${this.baseUrl}/CsrfToken`, '');

        const data = await this.tryParse(response);

        if(response.status != 201) {
            this.errorHandler.handle(response, data);
        }

        return (data as SuccessResponse<string>).data;
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

    protected buildBaseRequest(csrfToken?: string): RequestInit {
        const headers = new Headers(this.headers);

        if(csrfToken) headers.append('X-CSRF-TOKEN', csrfToken);
        
        return {
            headers,
            credentials: 'include'
        };
    }

    protected get(url: string, requestInit: RequestInit = {}) {
        return fetch(url, {
            ...this.buildBaseRequest(),
            ...requestInit
        })
    }    
    
    protected post(url: string, body: string, request: RequestInit = {}, csrfToken?: string) {
        return fetch(url, {
            ...request,
            ...this.buildBaseRequest(csrfToken),
            method: 'POST',
            body
        })
    }
}