export class InvalidFieldsError extends Error {
    private fields: {
        [key: string]: string
    };

    constructor(fields: { [key: string]: string }) {
        super();
        this.fields = fields;
    }

    public getFieldError(field: string) {
        return this.fields[field];
    }
}