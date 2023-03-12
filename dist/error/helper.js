"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isErr = exports.objErr = void 0;
const objErr = (err) => {
    return {
        status: false,
        isErr: true,
        errMsg: err.message,
        errCode: err.code || "",
        errRoutine: err.routine || "",
        err,
    };
};
exports.objErr = objErr;
const isErr = (obj) => "isErr" in obj && obj.isErr;
exports.isErr = isErr;
