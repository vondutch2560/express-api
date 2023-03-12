import { existsSync, mkdirSync } from "fs";
import { Router, Request, Response } from "express";
import { writeStream, readFilePromise, removePath } from "../helper/utils";
import { mochiAudioDir, mochiMd5File } from "../helper/abspath";
import { downloadAudioGoogleTrans } from "../helper/download";

const mochiRouter: Router = Router();
let listMD5: string[] = [];

if (!existsSync(mochiMd5File)) {
	mkdirSync(mochiAudioDir, { recursive: true });
	writeStream(mochiMd5File, JSON.stringify([]));
} else {
	readFilePromise(mochiMd5File, "utf8").then((data) => {
		listMD5 = JSON.parse(data as string);
	});
}

mochiRouter.post("/audio", async (req: Request, res: Response) => {
	// nếu dùng 1 mình thì không sao, nhưng nhiều người dùng thì khi kiểm tra sự trùng lặp MD5 nên đọc lại danh sách file
	if (listMD5.includes(req.body.md5)) {
		res.send({ error: true, msg: "Md5 code is exist" });
	} else {
		const result = await downloadAudioGoogleTrans(
			req.body.text,
			`${mochiAudioDir}/${req.body.md5}.mp3`,
		);
		if (result) {
			listMD5.push(req.body.md5);
			await writeStream(mochiMd5File, JSON.stringify(listMD5));
			res.send({
				success: true,
				listMD5,
				msg: "Download audio from Google Tranaslte success",
			});
		} else
			res.send({
				error: true,
				msg: "Cannot download audio from Google Translate",
			});
	}
});

mochiRouter.get("/md5", (_req: Request, res: Response): void => {
	res.send(listMD5);
});

mochiRouter.get("/delete/:md5", async (req: Request, res: Response) => {
	const result = await removePath(`${mochiAudioDir}/${req.params.md5}.mp3`);
	res.send({ result });
	// fix lai, moi chi delete file mp3. chua cap nhat lai file md5.json, va cung phai restart lai pm2 moi co hieu luc
});

export default mochiRouter;
