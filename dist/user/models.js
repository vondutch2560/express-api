"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToken = exports.createUser = exports.comparePass = exports.hashPassword = exports.getUserById = exports.getUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const helper_1 = require("../error/helper");
const jav_1 = require("../db/jav");
const utils_1 = require("../helper/utils");
const getUser = async (username) => {
    try {
        const con = await (0, jav_1.connect)();
        if ((0, helper_1.isErr)(con))
            return con;
        const client = con;
        try {
            const query = {
                text: "SELECT * FROM \"user\" WHERE \"username\" = $1 LIMIT 1",
                values: [username],
            };
            const result = await client.query(query);
            return result.rows[0];
        }
        catch (err) {
            return (0, helper_1.objErr)(err);
        }
        finally {
            client.release();
        }
    }
    catch (err) {
        return (0, helper_1.objErr)(err);
    }
};
exports.getUser = getUser;
const getUserById = async (id) => {
    try {
        const con = await (0, jav_1.connect)();
        if ((0, helper_1.isErr)(con))
            return false;
        const client = con;
        try {
            const query = {
                text: "SELECT * FROM \"user\" WHERE \"id\" = $1 LIMIT 1",
                values: [id],
            };
            const result = await client.query(query);
            return result.rows[0];
        }
        catch (err) {
            console.log((0, helper_1.objErr)(err));
            return false;
        }
        finally {
            client.release();
        }
    }
    catch (err) {
        console.log((0, helper_1.objErr)(err));
        return false;
    }
};
exports.getUserById = getUserById;
const hashPassword = (pass) => {
    return bcrypt_1.default.hashSync(pass, 10);
};
exports.hashPassword = hashPassword;
const comparePass = (password, haspass) => {
    return bcrypt_1.default.compareSync(password, haspass);
};
exports.comparePass = comparePass;
const createUser = async (newUser) => {
    try {
        const con = await (0, jav_1.connect)();
        if ((0, helper_1.isErr)(con))
            return con;
        const client = con;
        try {
            const insertQuery = {
                text: "INSERT INTO \"user\"(username, hashpass) VALUES($1, $2) RETURNING *",
                values: newUser,
            };
            const resCreateUser = await client.query(insertQuery);
            return resCreateUser.rows[0];
        }
        catch (err) {
            return (0, helper_1.objErr)(err);
        }
        finally {
            client.release();
        }
    }
    catch (err) {
        return (0, helper_1.objErr)(err);
    }
};
exports.createUser = createUser;
const updateToken = async (id, pubKey, refKey) => {
    try {
        const con = await (0, jav_1.connect)();
        if ((0, helper_1.isErr)(con))
            return con;
        const client = con;
        const expireRefreshToken = (0, utils_1.getTime)("s", 2592000);
        try {
            const updateQuery = {
                text: "UPDATE \"user\" SET \"public_key\" = $2, \"refresh_token\" = $3, \"exp_refresh_token\" = $4 WHERE \"id\" = $1",
                values: [id, pubKey, refKey, expireRefreshToken],
            };
            await client.query(updateQuery);
            return true;
        }
        catch (err) {
            return (0, helper_1.objErr)(err);
        }
        finally {
            client.release();
        }
    }
    catch (err) {
        return (0, helper_1.objErr)(err);
    }
};
exports.updateToken = updateToken;
