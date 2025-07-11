import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import express from "express";
import routes from "./api/index";
import cors from "cors";

dotenv.config();

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.DASHBOARD_URL || "https://arclify.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use("/", routes);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
  client.user?.setStatus("online");
});

client.login(process.env.DISCORD_TOKEN);
