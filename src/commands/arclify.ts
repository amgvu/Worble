import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("arclify")
  .setDescription("Provides the link to the app");

export async function execute(interaction: ChatInputCommandInteraction) {
  const dashboardURL = "https://arclify.vercel.app";
  await interaction.reply(`Access Arclify here: ${dashboardURL}`);
}
