import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("dashboard")
  .setDescription("Provides the link to the dashboard");

export async function execute(interaction: ChatInputCommandInteraction) {
  const dashboardURL = "https://arclify.vercel.app/";
  await interaction.reply(`Arclify Home Page: ${dashboardURL}`);
}
