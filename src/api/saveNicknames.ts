import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { client } from "../index";
import cors from "cors";

dotenv.config();

const router = express.Router();

router.use(
  cors({
    origin:
      process.env.DASHBOARD_URL ||
      "https://afternoon-temple-26946-e99dc6cf9cc7.herokuapp.com/https://arclify.vercel.app",
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true,
  })
);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL || "", SUPABASE_KEY || "");

router.post("/save-nicknames", async (req, res): Promise<any> => {
  const { guildId, nicknames } = req.body;

  if (!guildId || !nicknames) {
    return res
      .status(400)
      .json({ error: "guildId and nicknames are required." });
  }

  try {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ error: "Guild not found." });
    }

    const members = await guild.members.fetch();
    console.log("Fetched members:", members);

    const validNicknames: {
      guild_id: string;
      user_id: string;
      user_tag: string;
      nickname: string;
      updated_at: string;
      is_active: boolean;
    }[] = [];

    nicknames.forEach(
      (n: { userId: string; nickname: string; userTag?: string }) => {
        const member = members.get(n.userId);
        if (member) {
          const userTag = n.userTag || `${member.user.username}`;

          if (!userTag) {
            console.error(`userTag is missing for user ${n.userId}`);
            return;
          }

          validNicknames.push({
            guild_id: guildId,
            user_id: n.userId,
            user_tag: userTag,
            nickname: n.nickname,
            updated_at: new Date().toISOString(),
            is_active: true,
          });
        } else {
          console.error(`Member not found for user ${n.userId}`);
        }
      }
    );

    console.log("Valid nicknames:", validNicknames);

    if (validNicknames.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid nicknames found to save." });
    }

    const upsertResults = await Promise.all(
      validNicknames.map(async (nickname) => {
        const { data: existingNicknames, error: fetchError } = await supabase
          .from("nicknames")
          .select("*")
          .eq("guild_id", nickname.guild_id)
          .eq("user_id", nickname.user_id)
          .eq("nickname", nickname.nickname)
          .eq("is_active", true)
          .maybeSingle();

        if (fetchError) {
          console.error("Error checking existing nickname:", fetchError);
          return null;
        }

        if (existingNicknames) {
          return existingNicknames;
        }

        await supabase
          .from("nicknames")
          .update({ is_active: false })
          .eq("guild_id", nickname.guild_id)
          .eq("user_id", nickname.user_id)
          .eq("is_active", true);

        const { data, error } = await supabase
          .from("nicknames")
          .insert(nickname)
          .select();

        if (error) {
          console.error("Error saving nickname:", error);
          return null;
        }

        return data[0];
      })
    );

    const savedNicknames = upsertResults.filter((result) => result !== null);

    if (savedNicknames.length === 0) {
      return res.status(500).json({ error: "Failed to save any nicknames." });
    }

    res.status(200).json({
      message: "Nicknames processed successfully.",
      savedNicknames: savedNicknames,
    });
  } catch (error) {
    console.error("Error saving nicknames:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving nicknames." });
  }
});

export default router;
