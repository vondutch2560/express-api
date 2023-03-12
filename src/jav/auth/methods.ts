import jwt from "jsonwebtoken";
import crypto, { KeyObject } from "crypto";
import { Request, Response } from "express";
import { getTime } from "../../core/utils";
import { falseAndLog } from "../../core/ErrorHelper";
import { updateToken } from "../db/user";
import { PayloadToken, NewTokenJWT } from "../type";

export const genAccessToken = (payload: PayloadToken, priKey: string, expiresIn: string | number) =>
	jwt.sign(payload, priKey, { algorithm: "RS256", expiresIn });

export const genPriPubKey = () =>
	crypto.generateKeyPairSync("rsa", {
		modulusLength: 2048,
		publicKeyEncoding: {
			type: "spki",
			format: "pem",
		},
		privateKeyEncoding: {
			type: "pkcs8",
			format: "pem",
		},
	});

export const genRefreshToken = () => crypto.randomBytes(32).toString("hex");

export const verifyToken = (accessToken: string, publicKey: KeyObject | string) => {
	try {
		return jwt.verify(accessToken, publicKey);
	} catch (err) {
		return falseAndLog(err, ["auth/methods.ts", "verifyToken()", "error verify access token"]);
	}
};

export const isExpiredRereshToken = (expTime: number) => {
	return expTime - getTime("s") < 0;
};

export const decodeAccessToken = (accessToken: string): number | false => {
	const payload = jwt.decode(accessToken) as object;
	if (!payload) return false;
	if ("id" in payload) return payload.id as number;
	return false;
};

export const getAccessTokenHeaders = (req: Request) => {
	const xAuthHeader = req.headers["x-authorization"] as string;
	if (!xAuthHeader) return false;
	const xAuthParts = xAuthHeader.split(" ");
	if (xAuthParts[0] === "Bearer" && xAuthParts[1]) return xAuthParts[1];
	return false;
};

export const createNewJWT = async (userId: number): Promise<NewTokenJWT | false> => {
	const { privateKey, publicKey } = genPriPubKey();
	const accessToken = genAccessToken({ id: userId }, privateKey, 604800); // 7 days
	const refreshToken = genRefreshToken();
	const resultUpdateToken = await updateToken(userId, publicKey, refreshToken);

	return resultUpdateToken ? { accessToken, refreshToken } : false;
};

export const setTokenCookie = (res: Response, accessToken: string, refreshToken: string): void => {
	res.cookie("accessToken", accessToken, { maxAge: 2592000000, httpOnly: false, path: "/" });
	res.cookie("refreshToken", refreshToken, { maxAge: 7776000000, httpOnly: false, path: "/" });
};
