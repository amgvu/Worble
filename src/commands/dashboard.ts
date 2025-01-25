import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("dashboard")
  .setDescription("Provides the link to the ArcForge dashboard");

export async function execute(interaction: ChatInputCommandInteraction) {
  const dashboardURL = "http://localhost:3001/dashboard";
  await interaction.reply(`Access ArcForge here: ${dashboardURL}`);
}