import express from "express";
import { client } from "../index";

const router = express.Router();

// Rename endpoint
router.post("/rename", async (req, res): Promise<any> => {
  const { guildId, userId, nickname } = req.body;

  try {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: "Guild not found" });

    const member = await guild.members.fetch(userId);
    if (!member) return res.status(404).json({ error: "User not found" });

    await member.setNickname(nickname);
    res.status(200).json({ message: `Nickname updated to ${nickname}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the nickname." });
  }
});

export default router;
