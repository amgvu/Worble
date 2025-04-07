import express from "express";
import { client } from "../index";
import cors from "cors";

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

router.get("/members/:guild_id", async (req, res): Promise<any> => {
  try {
    const { guild_id } = req.params;

    const guild = client.guilds.cache.get(guild_id);
    if (!guild) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const botMember = guild.members.me;
    if (!botMember) {
      return res.status(500).json({ error: "Bot is not in the guild" });
    }

    const botHighestRole = botMember.roles.highest;
    const members = await guild.members.fetch();

    const memberList = members
      .filter(
        (member) =>
          member.user.id !== guild.ownerId &&
          member.roles.highest.position < botHighestRole.position
      )
      .map((member) => ({
        user_id: member.user.id,
        username: member.user.username,
        nickname: member.nickname,
        globalName: member.user.globalName || member.user.username,
        avatar_url:
          member.user.avatarURL({ extension: "png", size: 256 }) ||
          member.user.defaultAvatarURL,
        roles: member.roles.cache
          .filter((role) => role.id !== guild.id)
          .map((role) => ({
            role_id: role.id,
            name: role.name,
            position: role.position,
            color: role.color.toString(16),
          }))
          .sort((a, b) => b.position - a.position),
      }));

    return res.status(200).json(memberList);
  } catch (error) {
    console.error("Error fetching members:", error);
    return res.status(500).json({ error: "Failed to fetch members" });
  }
});

export default router;
