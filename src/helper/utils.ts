import { createWriteStream, mkdirSync, readFile } from "fs";
import { unlink } from "fs/promises";

export const createFolder = (absPath: string): void => {
	mkdirSync(absPath, { recursive: true });
};

export const getFileExt = (str: string): string | undefined =>
	str.split(".").pop();

export const writeStream = (
	absPath: string,
	data: string | Buffer,
): Promise<boolean> => {
	const cws = createWriteStream(absPath);
	cws.write(data);
	cws.end();
	return new Promise((resolve, reject) => {
		cws.on("finish", resolve);
		cws.on("error", reject);
	});
};

export const readFilePromise = (
	absPath: string,
	encoding: null | "utf8" = null,
): Promise<Buffer | string> => {
	return new Promise((resolve, reject) => {
		readFile(absPath, encoding, function (error, data) {
			if (error) reject(error);
			resolve(data);
		});
	});
};

export const removePath = async (absPath: string): Promise<boolean> => {
	try {
		await unlink(absPath);
		return true;
	} catch (error) {
		return false;
	}
};
