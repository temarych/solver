export class HTTPError extends Error {
    constructor(message, status) {
        super(message);
        Object.assign(this, { status });
    }
}

export class E404 extends HTTPError {
    constructor(message) {
        let status = 404;
        super(message, status);
    }
}