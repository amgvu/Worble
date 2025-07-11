export function getDiscordGuildIconURL(
  guildId: string,
  iconHash: string | null
): string | null {
  if (!iconHash) {
    return null;
  }
  const fileExtension = iconHash.startsWith("a_") ? ".gif" : ".png";
  return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}${fileExtension}`;
}
