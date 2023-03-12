import { PoolClient, Pool } from "pg";
import { falseAndLog } from "../../core/ErrorHelper";

const pool = new Pool({
	user: "haitrannguyen",
	host: "localhost",
	database: "jav",
	password: "Von931407612",
	port: 5432,
});

const connect = async (): Promise<PoolClient | false> => {
	try {
		const client: PoolClient = await pool.connect();
		return client;
	} catch (err) {
		return falseAndLog(err, ["connect.ts", "connect()", "error connect databse"]);
	}
};

process.on("SIGNIT", () => {
	pool.end();
	process.exit(0);
});

export default connect;
