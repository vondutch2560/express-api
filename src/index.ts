import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

import { staticDir } from "./helper/abspath";

import javRouter from "./jav/routes";
import mochiRouter from "./mochi/index";
import frontendRouter from "./frontend/routes";

dotenv.config();

const app: Express = express();

const corsOptions = {
	origin: "*",
	// origin: /localhost|mochidemy|vone\.one/gm,
	// origin: new RegExp(`${process.env.CORS}`, "gm"),
};
// test terminal bằng lệnh sau
// curl -H "Origin: http://vone.one/" --head http://localhost:4321/
// Trong response có dòng Access-Control-Allow-Origin là được phép truy cập

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/static", express.static(staticDir));

app.use("/jav", javRouter);
app.use("/mochi", mochiRouter);
app.use("/frontend", frontendRouter);

app.listen(4321, () => {
	console.log("ExpressJS running on 4321");
});
