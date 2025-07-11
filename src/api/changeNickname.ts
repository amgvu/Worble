import express from "express";
import { client } from "../index";
import cors from "cors";

const router = express.Router();

router.use(
  cors({
    origin: process.env.DASHBOARD_URL || "http://localhost:3001",
    methods: ["POST", "GET"],
    credentials: true,
  })
);

router.post("/changeNickname", async (req, res): Promise<any> => {
  try {
    const { guild_id, user_id, nickname, globalName } = req.body;

    if (!guild_id || !user_id || !globalName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const guild = client.guilds.cache.get(guild_id);
    if (!guild) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const member = await guild.members.fetch(user_id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    await member.setNickname(nickname || globalName);

    return res.status(200).json({ message: "Nickname applied successfully" });
  } catch (error) {
    console.error("Error setting nickname:", error);
    return res.status(500).json({ error: "Failed to set nickname" });
  }
});

export default router;
