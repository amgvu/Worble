import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("nicknames")
  .setDescription("Shows the current nicknames of all server members.");

export async function execute(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild;

  if (!guild) {
    await interaction.reply("This command can only be used in a server.");
    return;
  }

  try {
    await interaction.deferReply();

    const members = await guild.members.fetch();

    const formattedNicknames = members.map((member) => {
      const nickname = member.nickname || member.user.username;
      return `${member.user.globalName || member.user.tag}: ${nickname}`;
    }).join("\n");

    if (formattedNicknames.length > 2000) {
      await interaction.editReply("The list of nicknames is too long to display.");
      return;
    }

    // Sends the formatted list of nicknames
    await interaction.editReply(`Current Nicknames:\n${formattedNicknames}`);
  } catch (error) {
    console.error("Error fetching members:", error);
    await interaction.editReply("An error occurred while fetching member nicknames.");
  }
}


