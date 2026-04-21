import type { RegisterRequest } from "./requests/register-request";
import type { LoginRequest } from "./requests/login-request";
import type { SuccessResponse } from "./responses/success-response";
import type { RegisterResponseData } from "./responses/register-response";
import { ApiErrorHandler } from "./api-error-handler";
import { BaseClient } from "./BaseClient";

export class AuthorizationClient extends BaseClient {

    constructor(baseUrl: string, errorHandler?: ApiErrorHandler) {
        super(baseUrl, errorHandler);
    }

    public async register(request: RegisterRequest): Promise<SuccessResponse<RegisterResponseData>> {
        const response = await this.post(`${this.baseUrl}/user/register`, JSON.stringify(request));

        const data = await this.tryParse(response);

        if (response.status !== 201) {
            this.errorHandler.handle(response, data);
        }

        const result = data as SuccessResponse<RegisterResponseData>;
        return result;
    }

    public async login(request: LoginRequest): Promise<SuccessResponse<null>> {
        const response = await this.post(`${this.baseUrl}/user/login`, JSON.stringify(request));

        const data = await this.tryParse(response);

        if (response.status !== 200) {
            this.errorHandler.handle(response, data);
        }

        return data as SuccessResponse<null>;
    }

    public async logout(): Promise<null> {
        const response = await this.post(`${this.baseUrl}/user/logout`, '');

        if(response.status !== 200) {
            this.errorHandler.handle(response, null);
        }

        return null;
    }

    public async getProfile() {
        const response = await this.get(`${this.baseUrl}/profile/me`);

        const payload = await this.tryParse(response);

        if (response.status !== 200) {
            this.errorHandler.handle(response, payload);
        }        

        return (payload as SuccessResponse<{id: string, username: string}>).data;
    }
}