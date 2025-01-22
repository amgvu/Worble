import express from "express";
import dotenv from 'dotenv';

import saveNicknamesRouter from "./saveNicknames";
import changeNicknameRouter from "./changeNickname"; // new
import membersRouter from "./members";
import serversRouter from "./servers";

dotenv.config();

const router = express.Router();

router.use("/api", saveNicknamesRouter);
router.use("/api", changeNicknameRouter);
router.use("/api", membersRouter);
router.use("/api", serversRouter);

export default router;