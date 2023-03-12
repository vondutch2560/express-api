import { Router, Request, Response } from "express";
import path from "path";

const frontendRouter: Router = Router();

frontendRouter.get("/login", (req: Request, res: Response) => {
	res.sendFile(path.resolve("static/index.html"));
});

export default frontendRouter;
