"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const ErrorHelper_1 = require("../../core/ErrorHelper");
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
        return (0, ErrorHelper_1.falseAndLog)(err, ["connect.ts", "connect()", "error connect databse"]);
    }
};
process.on("SIGNIT", () => {
    pool.end();
    process.exit(0);
});
exports.default = connect;
