"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.falseAndLog = void 0;
const falseAndLog = (err, des = []) => {
    if (des.length > 0)
        if (des[2])
            console.log(`\n[${des[0]}] > ${des[1]} - ${des[2]}`);
        else
            console.log(`\n[${des[0]}] > ${des[1]}`);
    console.error(err);
    return false;
};
exports.falseAndLog = falseAndLog;
