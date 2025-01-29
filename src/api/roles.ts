import express from "express";
import { client } from "../index";
import cors from "cors";

const router = express.Router();

router.use(
  cors({
    origin: process.env.DASHBOARD_URL || "http://localhost:3001",
    methods: ["POST", "GET"],
    credentials: true,
  })
);

router.get("/roles/:guild_id", async (req, res): Promise<any> => {
  try {
    const { guild_id } = req.params;

    const guild = client.guilds.cache.get(guild_id);
    if (!guild) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const roles = guild.roles.cache.sort((a, b) => b.position - a.position);

    const roleList = roles.map((role) => ({
      role_id: role.id,
      name: role.name,
      position: role.position,
      color: role.color,
      isHoisted: role.hoist,
      isMentionable: role.mentionable,
    }));

    console.log("Fetched roles:", roleList);
    

    return res.status(200).json(roleList);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({ error: "Failed to fetch roles" });
  }
});

export default router;
