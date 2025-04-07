import express from "express";
import { client } from "../index";
import cors from "cors";
import { PermissionsBitField } from "discord.js";

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

router.post("/servers", async (req, res): Promise<any> => {
  try {
    console.log("API '/servers' endpoint called");
    const { accessToken, userId } = req.body;

    if (!accessToken || !userId) {
      return res.status(400).json({ error: "Missing accessToken or userId" });
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
      const errorData = await userServersResponse.text();
      console.error("Discord API error:", errorData);
      throw new Error("Failed to fetch user servers");
    }

    const userServers = await userServersResponse.json();
    console.log("User servers count:", userServers.length);

    const botServers = await client.guilds.fetch();
    console.log("Bot servers count:", botServers.size);

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
          mutualServers.push({
            id: userServer.id,
            name: userServer.name,
            icon: userServer.icon,
          });
        }
      } catch (error) {
        console.error(`Error processing server ${userServer.id}:`, error);
        continue;
      }
    }

    console.log("Mutual servers found:", mutualServers.length);
    return res.status(200).json(mutualServers);
  } catch (error) {
    console.error("Error fetching servers:", error);
    return res.status(500).json({ error: "Failed to fetch servers" });
  }
});

export default router;
