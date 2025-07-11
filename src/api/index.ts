import express from "express";
import dotenv from "dotenv";

import changeNicknameRouter from "./changeNickname";
import membersRouter from "./members";
import serversRouter from "./servers";
import rolesRouter from "./roles";

dotenv.config();

const router = express.Router();

router.use("/api", changeNicknameRouter);
router.use("/api", membersRouter);
router.use("/api", serversRouter);
router.use("/api", rolesRouter);

export default router;
