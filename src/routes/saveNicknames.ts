import express from "express";
import dotenv from 'dotenv';
import { createClient } from "@supabase/supabase-js";


dotenv.config();

const router = express.Router();

// Supabase initialization
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

const supabase = createClient(
    SUPABASE_URL || '',
    SUPABASE_KEY || ''
);

// Save nicknames endpoint
router.post("/save-nicknames", async (req, res): Promise<any> => {
  const { guildId, nicknames } = req.body;

  if (!guildId || !nicknames) {
    return res.status(400).json({ error: "guildId and nicknames are required." });
  }

  try {
    // Prepare data for batch upsert
    const nicknameData = nicknames.map((n: { userId: string; nickname: string; userTag: string }) => ({
      guild_id: guildId,
      user_id: n.userId,
      user_tag: n.userTag,
      nickname: n.nickname,
      updated_at: new Date().toISOString(),
    }));

    // Insert or update nicknames in Supabase
    const { error } = await supabase
      .from("nicknames")
      .upsert(nicknameData, { onConflict: "guild_id,user_id" });

    if (error) {
      console.error("Error saving nicknames:", error);
      return res.status(500).json({ error: "Failed to save nicknames to the database." });
    }

    res.status(200).json({ message: "Nicknames saved successfully." });
  } catch (error) {
    console.error("Error saving nicknames:", error);
    res.status(500).json({ error: "An error occurred while saving nicknames." });
  }
});

export default router;
