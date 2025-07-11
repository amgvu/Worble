import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import express from "express";
import routes from "./api/index";
import { ExtendedClient } from "./types/Client";
import cors from "cors";

dotenv.config();

export const client: ExtendedClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
}) as ExtendedClient;

client.commands = new Collection();

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

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  client.user?.setStatus("invisible");

  console.log(
    `Bot status set to: ${client.user?.presence.activities[0]?.name}`
  );
});

console.log(`Bot status set to: ${client.user?.presence.activities[1].name}`);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
