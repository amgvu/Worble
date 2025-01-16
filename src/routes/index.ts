import express from "express";
import changeNicknamesRoutes from "./changeNicknames";
import saveNicknamesRouter from "./saveNicknames";

const router = express.Router();

router.use("/api", changeNicknamesRoutes);
router.use("/api", saveNicknamesRouter);

export default router;