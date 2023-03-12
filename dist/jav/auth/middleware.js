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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const authFn = __importStar(require("./methods"));
const userFn = __importStar(require("../db/user"));
const CustomResponse_1 = require("../../core/CustomResponse");
const isAuth = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken)
        return (0, CustomResponse_1.sendFailure)(res, 401, "Không tìm thấy token");
    const userId = authFn.decodeAccessToken(accessToken);
    if (!userId)
        return (0, CustomResponse_1.sendFailure)(res, 401, "Không tìm thấy user id trong token");
    const user = await userFn.getUserBy("id", userId);
    if (!user)
        return (0, CustomResponse_1.sendFailure)(res, 550, "Không truy vấn được user");
    const isValidAccessToken = authFn.verifyToken(accessToken, user.public_key);
    if (isValidAccessToken)
        return next();
    if (refreshToken !== user.refresh_token)
        return (0, CustomResponse_1.sendFailure)(res, 401, "Refresh token không hợp lệ");
    const isExpiredRereshToken = authFn.isExpiredRereshToken(user.exp_refresh_token);
    if (isExpiredRereshToken)
        return (0, CustomResponse_1.sendFailure)(res, 401, "Refresh token hết hạn");
    const renewToken = await authFn.createNewJWT(user.id);
    if (!renewToken)
        return (0, CustomResponse_1.sendFailure)(res, 401, "Có lỗi khi update Token");
    authFn.setTokenCookie(res, renewToken.accessToken, renewToken.refreshToken);
    next();
};
exports.isAuth = isAuth;
