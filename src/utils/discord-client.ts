import { Client, GatewayIntentBits, Collection } from "discord.js";
import { ExtendedClient } from "../types/Client";

let client: ExtendedClient | null = null;

export function getDiscordClient(): Promise<ExtendedClient> {
  if (client && client.isReady()) {
    return Promise.resolve(client);
  }

  client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  }) as ExtendedClient;

  client.commands = new Collection();

  return new Promise((resolve, reject) => {
    client!.once("ready", () => {
      console.log(`Logged in as ${client!.user?.tag}!`);
      resolve(client!);
    });

    client!.login(process.env.DISCORD_TOKEN).catch(reject);
  });
}
