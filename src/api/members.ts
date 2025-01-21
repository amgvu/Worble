import express from "express";
import { client } from "../index";
import cors from "cors";

const router = express.Router();

router.use(cors({
  origin: process.env.DASHBOARD_URL || 'http://localhost:3001',
  methods: ['POST', 'GET'],
  credentials: true
}));

router.get('/members/:guild_id', async (req, res): Promise<any> => {
  try {
    const { guild_id } = req.params;

    const guild = client.guilds.cache.get(guild_id);
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    const members = await guild.members.fetch();
    const memberList = members
      .filter((member) => member.user.id !== guild.ownerId) // Exclude the server owner
      .map((member) => ({
        user_id: member.user.id,
        username: member.user.username,
        nickname: member.nickname || member.user.username,
      }));

    return res.status(200).json(memberList);
  } catch (error) {
    console.error('Error fetching members:', error);
    return res.status(500).json({ error: 'Failed to fetch members' });
  }
});

export default router;