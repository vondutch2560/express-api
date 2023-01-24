"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smbShareDir = exports.mochiMd5File = exports.mochiAudioDir = exports.mochiDir = exports.staticDir = exports.rootDir = void 0;
const dotenv = __importStar(require("dotenv"));
const path_1 = require("path");
const os_1 = __importDefault(require("os"));
dotenv.config();
exports.rootDir = (0, path_1.resolve)("./");
exports.staticDir = (0, path_1.join)(exports.rootDir, "static");
exports.mochiDir = (0, path_1.join)(exports.staticDir, "mochi");
exports.mochiAudioDir = (0, path_1.join)(exports.staticDir, "mochi", "audio");
exports.mochiMd5File = (0, path_1.join)(exports.staticDir, "mochi", "md5.json");
exports.smbShareDir = (0, path_1.join)(os_1.default.homedir(), "sambashare");
