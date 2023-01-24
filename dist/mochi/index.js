"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const express_1 = require("express");
const utils_1 = require("../helper/utils");
const abspath_1 = require("../helper/abspath");
const download_1 = require("../helper/download");
const mochiRouter = (0, express_1.Router)();
let listMD5 = [];
if (!(0, fs_1.existsSync)(abspath_1.mochiMd5File)) {
    (0, fs_1.mkdirSync)(abspath_1.mochiAudioDir, { recursive: true });
    (0, utils_1.writeStream)(abspath_1.mochiMd5File, JSON.stringify([]));
}
else {
    (0, utils_1.readFilePromise)(abspath_1.mochiMd5File, "utf8").then((data) => {
        listMD5 = JSON.parse(data);
    });
}
mochiRouter.post("/audio", async (req, res) => {
    if (listMD5.includes(req.body.md5)) {
        res.send({ error: true, msg: "Md5 code is exist" });
    }
    else {
        const result = await (0, download_1.downloadAudioGoogleTrans)(req.body.text, `${abspath_1.mochiAudioDir}/${req.body.md5}.mp3`);
        if (result) {
            listMD5.push(req.body.md5);
            await (0, utils_1.writeStream)(abspath_1.mochiMd5File, JSON.stringify(listMD5));
            res.send({
                success: true,
                listMD5,
                msg: "Download audio from Google Tranaslte success",
            });
        }
        else
            res.send({
                error: true,
                msg: "Cannot download audio from Google Translate",
            });
    }
});
mochiRouter.get("/md5", (_req, res) => {
    res.send(listMD5);
});
mochiRouter.get("/delete/:md5", async (req, res) => {
    const result = await (0, utils_1.removePath)(`${abspath_1.mochiAudioDir}/${req.params.md5}.mp3`);
    res.send({ result });
});
exports.default = mochiRouter;
