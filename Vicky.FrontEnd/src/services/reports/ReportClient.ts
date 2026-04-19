import { BaseClient } from "../BaseClient";
import type { ApiErrorHandler } from "../api-error-handler";
import type { Report } from "./types/Report";

export interface CalculateReportRequest {
  month: number;
  year: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export class ReportClient extends BaseClient {
  constructor(baseUrl: string, errorHandler: ApiErrorHandler) {
    super(baseUrl, errorHandler);
  }

  public async calculate(request: CalculateReportRequest): Promise<ApiResponse<Report>> {
    const url = `${this.baseUrl}/report/calculate`;

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: this.headers
    });

    const data = (await this.tryParse(response)) as ApiResponse<Report>;

    if (!response.ok) {
      this.errorHandler.handle(response, data);
    }

    return data;
  }
}
