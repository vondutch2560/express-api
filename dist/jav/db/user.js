"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToken = exports.createUser = exports.comparePass = exports.hashPassword = exports.getUserBy = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const connect_1 = __importDefault(require("./connect"));
const ErrorHelper_1 = require("../../core/ErrorHelper");
const utils_1 = require("../../core/utils");
const getUserBy = async (by, val) => {
    const client = await (0, connect_1.default)();
    if (!client)
        return (0, ErrorHelper_1.falseAndLog)("Không kết nối được database", ["db/user.ts", "getUserBy()"]);
    let query;
    switch (by) {
        case "username":
            query = {
                text: "SELECT * FROM \"user\" WHERE \"username\" = $1 LIMIT 1",
                values: [val],
            };
            break;
        case "id":
            query = {
                text: "SELECT * FROM \"user\" WHERE \"id\" = $1 LIMIT 1",
                values: [val],
            };
            break;
    }
    if (query === undefined)
        return (0, ErrorHelper_1.falseAndLog)("Can't get query string");
    try {
        const result = await client.query(query);
        return result.rows[0];
    }
    catch (err) {
        return (0, ErrorHelper_1.falseAndLog)(err, ["db/user.ts", "getUserBy", "Lỗi query get user"]);
    }
    finally {
        client.release();
    }
};
exports.getUserBy = getUserBy;
const hashPassword = (pass) => {
    return bcrypt_1.default.hashSync(pass, 10);
};
exports.hashPassword = hashPassword;
const comparePass = (password, haspass) => {
    return bcrypt_1.default.compareSync(password, haspass);
};
exports.comparePass = comparePass;
const createUser = async (newUser) => {
    const client = await (0, connect_1.default)();
    if (!client)
        return (0, ErrorHelper_1.falseAndLog)("Không kết nối được database", ["db/user.ts", "createUser()"]);
    if (!(newUser.length === 2))
        return (0, ErrorHelper_1.falseAndLog)("Data create user không hợp lệ", ["db/user.ts", "createUser()"]);
    try {
        const insertQuery = {
            text: "INSERT INTO \"user\"(username, hashpass) VALUES($1, $2) RETURNING *",
            values: newUser,
        };
        const resCreateUser = await client.query(insertQuery);
        return resCreateUser.rows[0];
    }
    catch (err) {
        return (0, ErrorHelper_1.falseAndLog)(err, ["db/user.ts", "createUser", "Lỗi khi tạo user"]);
    }
    finally {
        client.release();
    }
};
exports.createUser = createUser;
const updateToken = async (id, pubKey, refKey) => {
    const client = await (0, connect_1.default)();
    if (!client)
        return false;
    const expireRefreshToken = (0, utils_1.getTime)("s", 2592000);
    try {
        const updateQuery = {
            text: "UPDATE \"user\" SET \"public_key\" = $2, \"refresh_token\" = $3, \"exp_refresh_token\" = $4 WHERE \"id\" = $1",
            values: [id, pubKey, refKey, expireRefreshToken],
        };
        const resUpdate = await client.query(updateQuery);
        if (resUpdate)
            return true;
        return (0, ErrorHelper_1.falseAndLog)("Update Failed", ["db/user.ts", "updateToken", "update token user failure"]);
    }
    catch (err) {
        return (0, ErrorHelper_1.falseAndLog)(err, ["db/user", "updateToken", "query update token user"]);
    }
    finally {
        client.release();
    }
};
exports.updateToken = updateToken;
