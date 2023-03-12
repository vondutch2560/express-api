"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const pg_1 = require("pg");
const helper_1 = require("../error/helper");
const pool = new pg_1.Pool({
    user: "haitrannguyen",
    host: "localhost",
    database: "jav",
    password: "Von931407612",
    port: 5432,
});
const connect = async () => {
    try {
        const client = await pool.connect();
        return client;
    }
    catch (err) {
        return (0, helper_1.objErr)(err);
    }
};
exports.connect = connect;
process.on("SIGNIT", () => {
    pool.end();
    process.exit(0);
});
