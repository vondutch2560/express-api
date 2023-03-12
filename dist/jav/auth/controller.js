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
exports.login = exports.register = void 0;
const CustomResponse_1 = require("../../core/CustomResponse");
const userFn = __importStar(require("../db/user"));
const authFn = __importStar(require("./methods"));
const register = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    try {
        const user = await userFn.getUserBy("username", username);
        if (user)
            return (0, CustomResponse_1.sendFailure)(res, 421, "User đã tồn tại");
        if (user === false)
            return (0, CustomResponse_1.sendFailure)(res, 421, "Có lỗi khi kiểm tra user");
        const newUser = [username, userFn.hashPassword(password)];
        try {
            const resCreateUser = await userFn.createUser(newUser);
            if (!resCreateUser)
                return (0, CustomResponse_1.sendFailure)(res, 520, "Tạo tài khoản thất bại");
            return (0, CustomResponse_1.sendSuccess)(res, `Tại khoản ${username} được khởi tạo thành công`);
        }
        catch (err) {
            return (0, CustomResponse_1.sendFailure)(res, 520, err);
        }
    }
    catch (err) {
        return (0, CustomResponse_1.sendFailure)(res, 520, err);
    }
};
exports.register = register;
const login = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    try {
        const user = await userFn.getUserBy("username", username);
        if (user === false)
            return (0, CustomResponse_1.sendFailure)(res, 421, "Có lỗi khi kiểm tra user");
        if (user === undefined)
            return (0, CustomResponse_1.sendFailure)(res, 421, "User không tồn tại");
        if (!userFn.comparePass(password, user.hashpass))
            return (0, CustomResponse_1.sendFailure)(res, 401, "Password không chính xác");
        const newToken = await authFn.createNewJWT(user.id);
        if (!newToken)
            return (0, CustomResponse_1.sendFailure)(res, 521, "Có lỗi khi update Token");
        authFn.setTokenCookie(res, newToken.accessToken, newToken.refreshToken);
        return (0, CustomResponse_1.sendSuccess)(res, newToken);
    }
    catch (err) {
        return (0, CustomResponse_1.sendFailure)(res, 520, err);
    }
};
exports.login = login;
