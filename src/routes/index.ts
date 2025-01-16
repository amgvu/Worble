import express from "express";
import changeNicknamesRoutes from "./changeNicknames";
import saveNicknamesRouter from "./saveNicknames";

const router = express.Router();

// Use the different route modules
router.use("/api", changeNicknamesRoutes);
router.use("/api", saveNicknamesRouter); // Combine both under /api prefix

export default router;