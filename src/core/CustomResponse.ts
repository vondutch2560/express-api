/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

export const sendSuccess = (res: Response, data: any): void => {
	if (typeof data === "string") data = { msg: data };
	res.send({ ...data, success: true });
};

export const sendFailure = (res: Response, statusCode = 0, data: any): void => {
	if (typeof data === "string") data = { msg: data };
	if (statusCode !== 0) res.status(statusCode).send({ ...data, failure: true });
};
