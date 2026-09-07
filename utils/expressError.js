class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message);        // Required
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;