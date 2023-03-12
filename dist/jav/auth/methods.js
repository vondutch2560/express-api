"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokenCookie = exports.createNewJWT = exports.getAccessTokenHeaders = exports.decodeAccessToken = exports.isExpiredRereshToken = exports.verifyToken = exports.genRefreshToken = exports.genPriPubKey = exports.genAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("../../core/utils");
const ErrorHelper_1 = require("../../core/ErrorHelper");
const user_1 = require("../db/user");
const genAccessToken = (payload, priKey, expiresIn) => jsonwebtoken_1.default.sign(payload, priKey, { algorithm: "RS256", expiresIn });
exports.genAccessToken = genAccessToken;
const genPriPubKey = () => crypto_1.default.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "spki",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
    },
});
exports.genPriPubKey = genPriPubKey;
const genRefreshToken = () => crypto_1.default.randomBytes(32).toString("hex");
exports.genRefreshToken = genRefreshToken;
const verifyToken = (accessToken, publicKey) => {
    try {
        return jsonwebtoken_1.default.verify(accessToken, publicKey);
    }
    catch (err) {
        return (0, ErrorHelper_1.falseAndLog)(err, ["auth/methods.ts", "verifyToken()", "error verify access token"]);
    }
};
exports.verifyToken = verifyToken;
const isExpiredRereshToken = (expTime) => {
    return expTime - (0, utils_1.getTime)("s") < 0;
};
exports.isExpiredRereshToken = isExpiredRereshToken;
const decodeAccessToken = (accessToken) => {
    const payload = jsonwebtoken_1.default.decode(accessToken);
    if (!payload)
        return false;
    if ("id" in payload)
        return payload.id;
    return false;
};
exports.decodeAccessToken = decodeAccessToken;
const getAccessTokenHeaders = (req) => {
    const xAuthHeader = req.headers["x-authorization"];
    if (!xAuthHeader)
        return false;
    const xAuthParts = xAuthHeader.split(" ");
    if (xAuthParts[0] === "Bearer" && xAuthParts[1])
        return xAuthParts[1];
    return false;
};
exports.getAccessTokenHeaders = getAccessTokenHeaders;
const createNewJWT = async (userId) => {
    const { privateKey, publicKey } = (0, exports.genPriPubKey)();
    const accessToken = (0, exports.genAccessToken)({ id: userId }, privateKey, 604800);
    const refreshToken = (0, exports.genRefreshToken)();
    const resultUpdateToken = await (0, user_1.updateToken)(userId, publicKey, refreshToken);
    return resultUpdateToken ? { accessToken, refreshToken } : false;
};
exports.createNewJWT = createNewJWT;
const setTokenCookie = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, { maxAge: 2592000000, httpOnly: false, path: "/" });
    res.cookie("refreshToken", refreshToken, { maxAge: 7776000000, httpOnly: false, path: "/" });
};
exports.setTokenCookie = setTokenCookie;
