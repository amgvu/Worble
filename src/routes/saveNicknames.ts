import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { client } from "../index";

dotenv.config();

const router = express.Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(
  SUPABASE_URL || "",
  SUPABASE_KEY || ""
);

router.post("/save-nicknames", async (req, res): Promise<any> => {
    const { guildId, nicknames } = req.body;
  
    if (!guildId || !nicknames) {
      return res.status(400).json({ error: "guildId and nicknames are required." });
    }
  
    try {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) {
        return res.status(404).json({ error: "Guild not found." });
      }
  
      const members = await guild.members.fetch();
  
      const validNicknames: {
        guild_id: string;
        user_id: string;
        user_tag: string;
        nickname: string;
        updated_at: string;
      }[] = [];
  
      nicknames.forEach((n: { userId: string; nickname: string; userTag: string }) => {
        const member = members.get(n.userId);
        if (member) {
          const actualNickname = member.nickname || member.user.username;
          if (actualNickname === n.nickname) {
            validNicknames.push({
              guild_id: guildId,
              user_id: n.userId,
              user_tag: n.userTag,
              nickname: n.nickname,
              updated_at: new Date().toISOString(),
            });
          }
        }
      });
  
      if (validNicknames.length === 0) {
        return res.status(400).json({ error: "No valid nicknames found to save." });
      }
  
      const { error } = await supabase
        .from("nicknames")
        .upsert(validNicknames, { onConflict: "guild_id,user_id" });
  
      if (error) {
        console.error("Error saving nicknames:", error);
        return res.status(500).json({ error: "Failed to save nicknames to the database." });
      }
  
      res.status(200).json({ message: "Nicknames saved successfully.", savedNicknames: validNicknames });
    } catch (error) {
      console.error("Error saving nicknames:", error);
      res.status(500).json({ error: "An error occurred while saving nicknames." });
    }
  });

  export default router
  
