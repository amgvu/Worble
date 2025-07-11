import express from "express";
import { client } from "../index";

const router = express.Router();

router.post("/", async (req, res): Promise<void> => {
  try {
    const { guild_id, user_id, nickname, globalName } = req.body;

    if (!guild_id || !user_id || !globalName) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (!/^\d{17,19}$/.test(guild_id) || !/^\d{17,19}$/.test(user_id)) {
      res.status(400).json({ error: "Invalid guild ID or user ID format" });
      return;
    }

    const guild = client.guilds.cache.get(guild_id);
    if (!guild) {
      res.status(404).json({ error: "Guild not found" });
      return;
    }

    const botMember = guild.members.me;
    if (!botMember) {
      res.status(500).json({ error: "Bot is not in the guild" });
      return;
    }

    const member = await guild.members.fetch(user_id);
    if (!member) {
      res.status(404).json({ error: "Member not found" });
      return;
    }

    await member.setNickname(nickname || globalName);
    res.status(200).json({ message: "Nickname applied successfully" });
  } catch (error) {
    console.error("Error setting nickname:", error);
    res.status(500).json({ error: "Failed to set nickname" });
  }
});

export default router;
