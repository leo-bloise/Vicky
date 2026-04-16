export type BadRequestResponse = {
    type: string;
    title: string;
    detail: string;
    errors: string[];
    traceId: string;
}
