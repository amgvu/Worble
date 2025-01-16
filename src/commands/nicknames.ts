import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

const supabase = createClient(
    SUPABASE_URL || '',
    SUPABASE_KEY || ''
);

export const data = new SlashCommandBuilder()
  .setName("nicknames")
  .setDescription("Shows the current nicknames of all server members and stores them in the database.");

export async function execute(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild;

  if (!guild) {
    await interaction.reply("This command can only be used in a server.");
    return;
  }

  try {
    await interaction.deferReply();

    const members = await guild.members.fetch();

    const nicknameData = members.map((member) => {
      const nickname = member.nickname || member.user.username;
      return {
        guild_id: guild.id,
        user_id: member.id,
        user_tag: member.user.tag,
        nickname: nickname,
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await supabase
      .from("nicknames")
      .upsert(nicknameData, { onConflict: "guild_id,user_id" });

    if (error) {
      console.error("Error storing nicknames in database:", error);
      await interaction.editReply("An error occurred while saving nicknames to the database.");
      return;
    }

    const formattedNicknames = nicknameData
      .map((data) => `• **${data.user_tag}** → \`${data.nickname}\``)
      .join("\n");

    if (formattedNicknames.length > 2000) {
      await interaction.editReply("The list of nicknames is too long to display, but they have been saved to the database.");
      return;
    }

    await interaction.editReply(`**Server Nicknames (Saved to DB):**\n${formattedNicknames}`);
  } catch (error) {
    console.error("Error fetching or storing members:", error);
    await interaction.editReply("An error occurred while fetching or saving member nicknames.");
  }
}


