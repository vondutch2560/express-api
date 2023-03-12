"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTime = exports.removePath = exports.readFilePromise = exports.writeStream = exports.getFileExt = exports.createFolder = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const createFolder = (absPath) => {
    (0, fs_1.mkdirSync)(absPath, { recursive: true });
};
exports.createFolder = createFolder;
const getFileExt = (str) => str.split(".").pop();
exports.getFileExt = getFileExt;
const writeStream = (absPath, data) => {
    const cws = (0, fs_1.createWriteStream)(absPath);
    cws.write(data);
    cws.end();
    return new Promise((resolve, reject) => {
        cws.on("finish", resolve);
        cws.on("error", reject);
    });
};
exports.writeStream = writeStream;
const readFilePromise = (absPath, encoding = null) => {
    return new Promise((resolve, reject) => {
        (0, fs_1.readFile)(absPath, encoding, function (error, data) {
            if (error)
                reject(error);
            resolve(data);
        });
    });
};
exports.readFilePromise = readFilePromise;
const removePath = async (absPath) => {
    try {
        await (0, promises_1.unlink)(absPath);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.removePath = removePath;
const getTime = (type, option = "") => {
    switch (type) {
        case "s":
            return option === ""
                ? Math.ceil(Date.now() / 1000)
                : Math.ceil(Date.now() / 1000 + option);
        default:
            return Math.ceil(Date.now());
    }
};
exports.getTime = getTime;
