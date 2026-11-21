class ExpressError extends Error {
    constructor(statusCode, message, fields) {
        super(message);        // Required
        this.statusCode = statusCode;
        this.fields = fields
    }
}

export default ExpressError;