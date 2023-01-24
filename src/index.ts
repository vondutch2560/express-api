import express, { Express } from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import routerMochi from "./mochi/index";
dotenv.config();

const app: Express = express();

// origin sẽ dùng dotenv
const corsOptions = {
	origin: /localhost|mochidemy|vone\.one/gm,
};
// test terminal bằng lệnh sau
// curl -H "Origin: http://vone.one/" --head http://localhost:4321/
// Trong response có dòng Access-Control-Allow-Origin là được phép truy cập

app.use(cors(corsOptions));
app.use(express.json());

app.use("/mochi", routerMochi);

app.listen(4321, () => {
	console.log("ExpressJS running on 4321");
});
