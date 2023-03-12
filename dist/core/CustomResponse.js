"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFailure = exports.sendSuccess = void 0;
const sendSuccess = (res, data) => {
    if (typeof data === "string")
        data = { msg: data };
    res.send({ ...data, success: true });
};
exports.sendSuccess = sendSuccess;
const sendFailure = (res, statusCode = 0, data) => {
    if (typeof data === "string")
        data = { msg: data };
    if (statusCode !== 0)
        res.status(statusCode).send({ ...data, failure: true });
};
exports.sendFailure = sendFailure;
