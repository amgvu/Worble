import express from "express";
import { client } from "../index";
import { PermissionsBitField } from "discord.js";
import { getDiscordGuildIconURL } from "../utils/discord-icon";
import { ServerData } from "../types/types";

const router = express.Router();

router.post("/", async (req, res): Promise<void> => {
  try {
    const { accessToken, userId } = req.body;

    if (!accessToken || !userId) {
      res.status(400).json({ error: "Missing accessToken or userId" });
      return;
    }

    if (!/^\d{17,19}$/.test(userId)) {
      res.status(400).json({ error: "Invalid userId format" });
      return;
    }

    const userServersResponse = await fetch(
      "https://discord.com/api/v10/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userServersResponse.ok) {
      const status = userServersResponse.status;
      if (status === 401) {
        res.status(401).json({ error: "Invalid access token" });
        return;
      }
      throw new Error(`Discord API error: ${status}`);
    }

    const userServers = await userServersResponse.json();
    const botServers = await client.guilds.fetch();
    const mutualServers: ServerData[] = [];

    await Promise.allSettled(
      userServers.map(async (userServer: any) => {
        const botServer = botServers.get(userServer.id);
        if (!botServer) return;

        try {
          const server = await botServer.fetch();
          const member = await server.members.fetch(userId);

          if (
            member?.permissions.has(PermissionsBitField.Flags.ManageNicknames)
          ) {
            mutualServers.push({
              id: userServer.id,
              name: userServer.name,
              icon: userServer.icon,
              iconURL: getDiscordGuildIconURL(userServer.id, userServer.icon),
              memberCount: server.memberCount || server.members.cache.size,
            });
          }
        } catch (error) {
          console.error(
            `Error processing server ${userServer.id}:`,
            (error as Error).message
          );
        }
      })
    );

    res.status(200).json(mutualServers);
  } catch (error) {
    console.error("Error fetching servers:", error);
    res.status(500).json({ error: "Failed to fetch servers" });
  }
});

export default router;
