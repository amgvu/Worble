import express from "express";
import { client } from "../index";
import { PermissionsBitField } from "discord.js";

const router = express.Router();

function getDiscordGuildIconURL(
  guildId: string,
  iconHash: string | null
): string | null {
  if (!iconHash) {
    return null;
  }
  const fileExtension = iconHash.startsWith("a_") ? ".gif" : ".png";
  return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}${fileExtension}`;
}

router.post("/", async (req, res): Promise<any> => {
  try {
    const { accessToken, userId } = req.body;
    if (!accessToken || !userId) {
      return res.status(400).json({ error: "Missing accessToken or userId" });
    }

    const userServers = await new Promise<any[]>(async (resolve, reject) => {
      try {
        const userServersResponse = await fetch(
          "https://discord.com/api/v10/users/@me/guilds",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!userServersResponse.ok) {
          const errorData = await userServersResponse.text();
          console.error("Discord API error:", errorData);
          reject(new Error("Failed to fetch user servers"));
          return;
        }

        const data = await userServersResponse.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });

    const botServers = await client.guilds.fetch();
    const mutualServers = [];

    for (const userServer of userServers) {
      const botServer = botServers.get(userServer.id);
      if (!botServer) continue;

      try {
        const server = await botServer.fetch();
        const member = await server.members.fetch(userId);

        if (
          member &&
          member.permissions.has(PermissionsBitField.Flags.ManageNicknames)
        ) {
          const memberCount = server.members.cache.size;
          console.log(memberCount);

          mutualServers.push({
            id: userServer.id,
            name: userServer.name,
            icon: userServer.icon,
            iconURL: getDiscordGuildIconURL(userServer.id, userServer.icon),
            memberCount: memberCount,
          });
        }
      } catch (error) {
        console.error(`Error processing server ${userServer.id}:`, error);
        continue;
      }
    }

    return res.status(200).json(mutualServers);
  } catch (error) {
    console.error("Error fetching servers:", error);
    return res.status(500).json({ error: "Failed to fetch servers" });
  }
});

export default router;
