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
exports.testAuth = exports.login = exports.register = void 0;
const helper_1 = require("../error/helper");
const userFn = __importStar(require("../user/models"));
const authFn = __importStar(require("./methods"));
const register = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    try {
        const user = await userFn.getUser(username);
        if (user)
            return res.status(421).send("User đã tồn tại");
        const newUser = [username, userFn.hashPassword(password)];
        try {
            const resCreateUser = await userFn.createUser(newUser);
            if ((0, helper_1.isErr)(resCreateUser))
                return res.status(520).send(resCreateUser);
            return res.send(`Tại khoản ${username} được khởi tạo thành công`);
        }
        catch (error) {
            return res.status(520).send((0, helper_1.objErr)(error));
        }
    }
    catch (error) {
        return res.status(520).send((0, helper_1.objErr)(error));
    }
};
exports.register = register;
const login = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    try {
        const user = await userFn.getUser(username);
        if (user === undefined)
            return res.status(401).send("Tên đăng nhập không tồn tại");
        if ("hashpass" in user && !userFn.comparePass(password, user.hashpass))
            return res.status(401).send({ msg: "Mật khẩu không chính xác" });
        if (!("username" in user))
            return res.send("Không tìm thấy user");
        const newToken = await authFn.createNewJWT(user.id);
        if ("isErr" in newToken)
            return res.status(521).send("Có lỗi khi update Token");
        authFn.setTokenCookie(res, newToken.accessToken, newToken.refreshToken);
        return res.send(newToken);
    }
    catch (error) {
        return res.status(520).send((0, helper_1.objErr)(error));
    }
};
exports.login = login;
const testAuth = async (req, res) => {
    res.send("test authenticate");
};
exports.testAuth = testAuth;
