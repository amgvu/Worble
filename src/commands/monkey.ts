import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("monkey")
  .setDescription("business");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply(
    "https://tenor.com/view/just-monkey-business-gif-13449299463832787070"
  );
}
