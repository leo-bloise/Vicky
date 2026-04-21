import type { ApiErrorHandler } from "../api-error-handler";
import type { CreateCounterpartyRequest } from "../requests/create-counterparty-request";
import type { CounterpartyResponse } from "../responses/counterparty-response";
import type { SuccessResponse } from "../responses/success-response";
import type { GetCounterpartiesRequest, GetCounterpartiesResponse, GetCounterpartiesByCursorRequest, GetCounterpartiesByCursorResponse } from "./types";
import { BaseClient } from "../BaseClient";

export class CounterpartiesClient extends BaseClient {
    
    constructor(baseUrl: string, errorHandler: ApiErrorHandler ) {
        super(baseUrl, errorHandler);
    }

    public async create(request: CreateCounterpartyRequest): Promise<SuccessResponse<CounterpartyResponse>> {        
        const response = await this.post(`${this.baseUrl}/counterparty`, JSON.stringify(request));

        const data = await this.tryParse(response);

        if (response.status !== 201) {
            this.errorHandler.handle(response, data);
        }

        const result = data as SuccessResponse<CounterpartyResponse>;
        return result;
    }

    public async getCounterparties(request: GetCounterpartiesRequest): Promise<GetCounterpartiesResponse> {
        const url = new URL(`${this.baseUrl}/counterparty`);
        
        url.searchParams.append('pageNumber', request.pageNumber.toString());
        url.searchParams.append('pageSize', request.pageSize.toString());
        url.searchParams.append('startDate', request.startDate);
        url.searchParams.append('endDate', request.endDate);

        if (request.name) {
            url.searchParams.append('name', request.name);
        }

        const response = await this.get(url.toString());

        const data = await this.tryParse(response);

        if (response.status !== 200) {
            this.errorHandler.handle(response, data);
        }

        return data as GetCounterpartiesResponse;
    }

    public async getCursor(request: GetCounterpartiesByCursorRequest): Promise<GetCounterpartiesByCursorResponse> {
        const url = new URL(`${this.baseUrl}/counterparty/cursor`);
        
        if (request.limit) {
            url.searchParams.append('limit', request.limit.toString());
        }
        if (request.continuationToken) {
            url.searchParams.append('continuationToken', request.continuationToken);
        }
        if (request.name) {
            url.searchParams.append('name', request.name);
        }

        const response = await this.get(url.toString());

        const data = await this.tryParse(response);

        if (response.status !== 200) {
            this.errorHandler.handle(response, data);
        }

        return data as GetCounterpartiesByCursorResponse;
    }
}