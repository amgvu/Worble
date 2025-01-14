import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();
console.log("Token:", process.env.DISCORD_TOKEN);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);
