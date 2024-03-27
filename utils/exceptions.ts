export class ValidationException extends Error {
    public errorType: string;
    public status: number;
    constructor(public message: string, public statusNumber: number) {
        super(message);
        this.errorType = 'Validation'
        this.status = statusNumber
    }
}

export class UnhandledData extends Error{
    public errorType: string;
    public status: number;
    constructor(public message: string, public statusNumber: number){
        super(message);
        this.errorType = "UnhandledData";
        this.status = statusNumber;
    }
}