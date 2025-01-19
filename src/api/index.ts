import express from "express";
import dotenv from 'dotenv';

import changeNicknamesRoutes from "./changeNicknames";
import saveNicknamesRouter from "./saveNicknames";
import nicknamesRouter from "./nickname";

dotenv.config();

const router = express.Router();

router.use("/api", changeNicknamesRoutes);
router.use("/api", saveNicknamesRouter);
router.use("/api", nicknamesRouter);

export default router;