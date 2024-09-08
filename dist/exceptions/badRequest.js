"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestsException = void 0;
const root_1 = require("./root");
class BadRequestsException extends root_1.HttpException {
    constructor(message, errorCode, error) {
        super(message, errorCode, 400, error);
    }
}
exports.BadRequestsException = BadRequestsException;
