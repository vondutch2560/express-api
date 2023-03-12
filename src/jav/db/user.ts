import bcrypt from "bcrypt";
import connect from "./connect";
import { falseAndLog } from "../../core/ErrorHelper";
import { NewUser, UserInfo, QueryObject } from "../type";
import { getTime } from "../../core/utils";

export const getUserBy = async (
	by: string,
	val: number | string,
): Promise<UserInfo | undefined | false> => {
	const client = await connect();
	if (!client) return falseAndLog("Không kết nối được database", ["db/user.ts", "getUserBy()"]);

	let query: QueryObject | undefined;
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

	if (query === undefined) return falseAndLog("Can't get query string");

	try {
		const result = await client.query(query);
		return result.rows[0]; // undefined hoặc userinfo
	} catch (err) {
		return falseAndLog(err, ["db/user.ts", "getUserBy", "Lỗi query get user"]);
	} finally {
		client.release();
	}
};

export const hashPassword = (pass: string): string => {
	return bcrypt.hashSync(pass, 10); // SALT_ROUNDS = 10
};

export const comparePass = (password: string, haspass: string): boolean => {
	return bcrypt.compareSync(password, haspass);
};

export const createUser = async (newUser: NewUser): Promise<UserInfo | false> => {
	const client = await connect();
	if (!client) return falseAndLog("Không kết nối được database", ["db/user.ts", "createUser()"]);
	if (!(newUser.length === 2))
		return falseAndLog("Data create user không hợp lệ", ["db/user.ts", "createUser()"]);

	try {
		const insertQuery = {
			text: "INSERT INTO \"user\"(username, hashpass) VALUES($1, $2) RETURNING *",
			values: newUser,
		};

		const resCreateUser = await client.query(insertQuery);
		return resCreateUser.rows[0]; // userinfo
	} catch (err) {
		return falseAndLog(err, ["db/user.ts", "createUser", "Lỗi khi tạo user"]);
	} finally {
		client.release();
	}
};

export const updateToken = async (
	id: number | string,
	pubKey: string,
	refKey: string,
): Promise<boolean> => {
	const client = await connect();
	if (!client) return false;

	const expireRefreshToken = getTime("s", 2592000); // 30 day

	try {
		const updateQuery = {
			text: "UPDATE \"user\" SET \"public_key\" = $2, \"refresh_token\" = $3, \"exp_refresh_token\" = $4 WHERE \"id\" = $1",
			values: [id, pubKey, refKey, expireRefreshToken],
		};
		const resUpdate = await client.query(updateQuery);
		if (resUpdate) return true;
		return falseAndLog("Update Failed", ["db/user.ts", "updateToken", "update token user failure"]);
	} catch (err) {
		return falseAndLog(err, ["db/user", "updateToken", "query update token user"]);
	} finally {
		client.release();
	}
};
