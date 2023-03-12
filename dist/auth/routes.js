"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const middlewares_1 = require("./middlewares");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", controller_1.register);
authRouter.post("/login", controller_1.login);
authRouter.get("/", middlewares_1.isAuth, controller_1.testAuth);
exports.default = authRouter;