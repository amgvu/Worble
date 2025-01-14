import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("rah")
  .setDescription("Eye of Rah");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply("https://tenor.com/view/funny-eyeofrah-eye-of-rah-gif-9337038677048830451");
}