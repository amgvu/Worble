import express from "express";
import { client } from "../index";
import { MemberData } from "../types/types";

const router = express.Router();

router.get("/:guild_id", async (req, res): Promise<void> => {
  try {
    const { guild_id } = req.params;

    if (!/^\d{17,19}$/.test(guild_id)) {
      res.status(400).json({ error: "Invalid guild ID format" });
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

    const botHighestRole = botMember.roles.highest;
    const members = await guild.members.fetch();

    const memberList: MemberData[] = members
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
            color: role.color.toString(16).padStart(6, "0"),
          }))
          .sort((a, b) => b.position - a.position),
      }));

    res.status(200).json(memberList);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

export default router;
