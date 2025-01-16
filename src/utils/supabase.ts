import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Fetch all arc names for a specific guild.
 * @param guildId
 * @returns
 */
export async function getArcNames(guildId: string) {
  try {
    const { data, error } = await supabase
      .from('arcs')
      .select('arc_name')
      .eq('guild_id', guildId);

    if (error) throw error;
    return data?.map((arc) => arc.arc_name) || [];
  } catch (err) {
    console.error('Error fetching arc names:', err);
    return null;
  }
}

/**
 * Store nicknames for an arc
 * @param guildId
 * @param arcName
 * @param nicknameMap
 * @returns 
 */
export async function storeNicknames(guildId: string, arcName: string, nicknameMap: Record<string, string>) {
  try {
    const { data, error } = await supabase.from('arcs').insert([
      {
        guild_id: guildId,
        arc_name: arcName,
        nickname_map: nicknameMap,
      },
    ]);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error storing nicknames:', err);
    return null;
  }
}
