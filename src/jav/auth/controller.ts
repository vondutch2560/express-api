import { Request, Response } from "express";
import { sendSuccess, sendFailure } from "../../core/CustomResponse";
import * as userFn from "../db/user";
import * as authFn from "./methods";
import { NewUser } from "../type";

export const register = async (req: Request, res: Response) => {
	const username: string = req.body.username.toLowerCase();
	const password: string = req.body.password;
	try {
		const user = await userFn.getUserBy("username", username);

		if (user) return sendFailure(res, 421, "User đã tồn tại");
		if (user === false) return sendFailure(res, 421, "Có lỗi khi kiểm tra user");

		const newUser: NewUser = [username, userFn.hashPassword(password)];

		try {
			const resCreateUser = await userFn.createUser(newUser);
			if (!resCreateUser) return sendFailure(res, 520, "Tạo tài khoản thất bại");
			return sendSuccess(res, `Tại khoản ${username} được khởi tạo thành công`);
		} catch (err) {
			return sendFailure(res, 520, err);
		}
	} catch (err) {
		return sendFailure(res, 520, err);
	}
};

export const login = async (req: Request, res: Response) => {
	const username: string = req.body.username.toLowerCase();
	const password: string = req.body.password;

	try {
		const user = await userFn.getUserBy("username", username);

		if (user === false) return sendFailure(res, 421, "Có lỗi khi kiểm tra user");
		if (user === undefined) return sendFailure(res, 421, "User không tồn tại");

		if (!userFn.comparePass(password, user.hashpass))
			return sendFailure(res, 401, "Password không chính xác");

		const newToken = await authFn.createNewJWT(user.id);

		if (!newToken) return sendFailure(res, 521, "Có lỗi khi update Token");

		authFn.setTokenCookie(res, newToken.accessToken, newToken.refreshToken);

		return sendSuccess(res, newToken);
	} catch (err) {
		return sendFailure(res, 520, err);
	}
};
