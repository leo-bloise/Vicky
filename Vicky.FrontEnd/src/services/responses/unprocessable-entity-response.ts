export type UnprocessableEntityResponse = {
    type: string;
    title: string;
    detail: string;
    errors: {
        [key: string]: string[]
    };
    traceId: string;
}
