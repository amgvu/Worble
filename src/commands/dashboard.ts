import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("dashboard")
  .setDescription("Provides link to the ArcPanel dashboard");

export async function execute(interaction: ChatInputCommandInteraction) {
  const dashboardURL = "http://localhost:3000"; // Replace with real URL later
  await interaction.reply(`Access your ArcPanel here: ${dashboardURL}`);
}