import axios from "axios";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { getFileExt } from "./utils";

async function downloadCoverJav(url: string, code: string, stoDir: string) {
	existsSync(stoDir) && mkdirSync(stoDir);
	const writeImg = createWriteStream(`${stoDir}/${code}.${getFileExt(url)}`);
	const response = await axios({ url, method: "GET", responseType: "stream" });
	response.data.pipe(writeImg);

	return new Promise((resolve, reject) => {
		writeImg.on("finish", resolve);
		writeImg.on("error", reject);
	});
}

async function downloadAudioGoogleTrans(
	str: string,
	pathName: string,
): Promise<boolean> {
	const audioFile = createWriteStream(pathName);
	const url = `https://translate.google.com/translate_tts?ie=UTF-&&client=tw-ob&tl=en&q=${str.replace(
		"%",
		" percent",
	)}`;
	const response = await axios({ url, method: "GET", responseType: "stream" });
	response.data.pipe(audioFile);

	return new Promise((resolve, reject) => {
		audioFile.on("finish", () => {
			resolve(true);
		});
		audioFile.on("error", () => {
			reject(false);
		});
	});
}

export { downloadCoverJav, downloadAudioGoogleTrans };
