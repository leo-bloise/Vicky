import type { ApiErrorHandler } from "../api-error-handler";
import type { CreateCounterpartyRequest } from "../requests/create-counterparty-request";
import type { CounterpartyResponse } from "../responses/counterparty-response";
import type { SuccessResponse } from "../responses/success-response";
import type { GetCounterpartiesRequest, GetCounterpartiesResponse } from "./types";
import { BaseClient } from "../BaseClient";

export class CounterpartiesClient extends BaseClient {
    
    constructor(baseUrl: string, errorHandler: ApiErrorHandler ) {
        super(baseUrl, errorHandler);
    }

    public async create(request: CreateCounterpartyRequest): Promise<SuccessResponse<CounterpartyResponse>> {
        const url = `${this.baseUrl}/counterparty`;

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: this.headers
        });

        const data = await this.tryParse(response);

        if (response.status !== 201) {
            this.errorHandler.handle(response, data);
        }

        const result = data as SuccessResponse<CounterpartyResponse>;
        return result;
    }

    public async get(request: GetCounterpartiesRequest): Promise<GetCounterpartiesResponse> {
        const url = new URL(`${this.baseUrl}/counterparty`);
        url.searchParams.append('pageNumber', request.pageNumber.toString());
        url.searchParams.append('pageSize', request.pageSize.toString());
        url.searchParams.append('startDate', request.startDate);
        url.searchParams.append('endDate', request.endDate);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: this.headers
        });

        const data = await this.tryParse(response);

        if (response.status !== 200) {
            this.errorHandler.handle(response, data);
        }

        return data as GetCounterpartiesResponse;
    }
}