import express from "express";
import dotenv from "dotenv";

import changeNicknameRouter from "./changeNickname";
import membersRouter from "./members";
import serversRouter from "./servers";

dotenv.config();

const router = express.Router();

router.use("/changeNickname", changeNicknameRouter);
router.use("/members", membersRouter);
router.use("/servers", serversRouter);

export default router;
