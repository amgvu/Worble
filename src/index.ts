import { Client, GatewayIntentBits, Collection, ActivityType } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import express from "express";
import routes from "./api/index";
import { ExtendedClient } from "./types/Client";
import net from 'net';

dotenv.config();

const findAvailablePort = async (startPort: number, maxAttempts = 10): Promise<number> => {
  const isPortAvailable = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const server = net.createServer()
        .once('error', () => resolve(false))
        .once('listening', () => {
          server.close();
          resolve(true);
        })
        .listen(port);
    });
  };

  for (let port = startPort; port < startPort + maxAttempts; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error('No available ports found');
};

export const client: ExtendedClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
}) as ExtendedClient;

client.commands = new Collection();

const app = express();
app.use(express.json());

app.use("/", routes);

(async () => {
  try {
    const port = await findAvailablePort(3000);
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  client.user?.setStatus('invisible');

  console.log(`Bot status set to: ${client.user?.presence.activities[0]?.name}`);
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


