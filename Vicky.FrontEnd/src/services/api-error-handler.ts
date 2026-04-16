import type { BadRequestResponse } from "./responses/bad-request-response";
import type { UnprocessableEntityResponse } from "./responses/unprocessable-entity-response";
import { InvalidFieldsError } from "./invalid-fields-error";

export class ApiErrorHandler {
    handle(response: Response, data: unknown): void {
        switch (response.status) {
            case 400:
                const badRequest = data as BadRequestResponse;
                throw new Error(badRequest.detail || badRequest.errors?.[0] || 'Bad request');

            case 422:
                const unprocessable = data as UnprocessableEntityResponse;
                const fieldErrors: { [key: string]: string } = {};

                if (unprocessable.errors) {
                    Object.entries(unprocessable.errors).forEach(([field, messages]) => {
                        fieldErrors[field] = messages[0] || 'Invalid field';
                    });
                }

                throw new InvalidFieldsError(fieldErrors);

            case 401:
                throw new Error('Unauthorized. Please log in again.');

            case 403:
                throw new Error('Forbidden. You do not have permission to access this resource.');

            case 404:
                throw new Error('Resource not found.');

            case 500:
                throw new Error('Internal server error. Please try again later.');

            default:
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    }
}
