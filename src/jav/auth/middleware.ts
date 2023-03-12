import { NextFunction, Request, Response } from "express";
import * as authFn from "./methods";
import * as userFn from "../db/user";
import { sendFailure } from "../../core/CustomResponse";

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;

	if (!accessToken) return sendFailure(res, 401, "Không tìm thấy token");

	const userId = authFn.decodeAccessToken(accessToken);
	if (!userId) return sendFailure(res, 401, "Không tìm thấy user id trong token");

	const user = await userFn.getUserBy("id", userId);
	if (!user) return sendFailure(res, 550, "Không truy vấn được user");

	const isValidAccessToken = authFn.verifyToken(accessToken, user.public_key);
	if (isValidAccessToken) return next();

	if (refreshToken !== user.refresh_token)
		return sendFailure(res, 401, "Refresh token không hợp lệ");

	const isExpiredRereshToken = authFn.isExpiredRereshToken(user.exp_refresh_token);
	if (isExpiredRereshToken) return sendFailure(res, 401, "Refresh token hết hạn");

	const renewToken = await authFn.createNewJWT(user.id);
	if (!renewToken) return sendFailure(res, 401, "Có lỗi khi update Token");

	authFn.setTokenCookie(res, renewToken.accessToken, renewToken.refreshToken);

	next();
};
