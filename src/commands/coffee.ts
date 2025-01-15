import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("coffee")
  .setDescription("coffee");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply("https://tenor.com/view/yuimetal-gif-2236335851178412850");
}