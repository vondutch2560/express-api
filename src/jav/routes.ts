import { Router } from "express";
import { login, register } from "./auth/controller";
import { scanfile } from "./film/controller";
import { isAuth } from "./auth/middleware";

const javRouter: Router = Router();

javRouter.post("/register", register);
javRouter.post("/login", login);
javRouter.post("/scanfile", isAuth, scanfile);

export default javRouter;
