import type { RegisterRequest } from "./requests/register-request";
import type { LoginRequest } from "./requests/login-request";
import type { SuccessResponse } from "./responses/success-response";
import type { LoginResponseData } from "./responses/login-response";
import type { RegisterResponseData } from "./responses/register-response";
import { ApiErrorHandler } from "./api-error-handler";
import { BaseClient } from "./BaseClient";

export class AuthorizationClient extends BaseClient {

    constructor(baseUrl: string, errorHandler?: ApiErrorHandler) {
        super(baseUrl, errorHandler);
    }

    public async register(request: RegisterRequest): Promise<SuccessResponse<RegisterResponseData>> {
        const url = `${this.baseUrl}/user/register`;

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: this.headers
        });

        const data = await this.tryParse(response);

        if (response.status !== 201) {
            this.errorHandler.handle(response, data);
        }

        const result = data as SuccessResponse<RegisterResponseData>;
        return result;
    }

    public async login(request: LoginRequest): Promise<SuccessResponse<LoginResponseData>> {
        const url = `${this.baseUrl}/user/login`;

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: this.headers
        });

        const data = await this.tryParse(response);

        if (response.status !== 200) {
            this.errorHandler.handle(response, data);
        }

        const result = data as SuccessResponse<LoginResponseData>;
        console.log(result);
        this.token = result.data.token.payload;
        localStorage.setItem('vickyToken', this.token);
        this.updateAuthHeader();

        return result;
    }

    public async getProfile() {
        const url = `${this.baseUrl}/profile/me`;

        const response = await fetch(url, {
            method: 'GET',
            headers: this.headers
        });

        const payload = await this.tryParse(response);

        if (response.status !== 200) {
            this.errorHandler.handle(response, payload);
        }        

        return (payload as SuccessResponse<{id: string, username: string}>).data;
    }

    public setToken(token: string) {
        this.token = token;
        this.headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    public getToken(): string | null {
        return this.token;
    }
}