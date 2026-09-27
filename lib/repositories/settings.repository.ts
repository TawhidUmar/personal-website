import { query, queryOne, execute } from '@/lib/db/connection';
import type { DbSetting, SettingType } from '@/types/db.types';

export async function getAllSettings(): Promise<DbSetting[]> {
  return query<DbSetting>(`SELECT * FROM settings ORDER BY group_name, \`key\``);
}

export async function getPublicSettings(): Promise<DbSetting[]> {
  return query<DbSetting>(
    `SELECT * FROM settings WHERE is_public = 1 ORDER BY group_name, \`key\``
  );
}

export async function getSettingByKey(key: string): Promise<DbSetting | null> {
  return queryOne<DbSetting>(
    `SELECT * FROM settings WHERE \`key\` = ? LIMIT 1`,
    [key]
  );
}

export async function getSettingsByGroup(group: string): Promise<DbSetting[]> {
  return query<DbSetting>(
    `SELECT * FROM settings WHERE group_name = ? ORDER BY \`key\``,
    [group]
  );
}

export async function upsertSetting(
  key: string,
  value: string,
  type: SettingType = 'string',
  group: string = 'general'
): Promise<void> {
  await execute(
    `INSERT INTO settings (\`key\`, value, type, group_name)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE value = ?, type = ?`,
    [key, value, type, group, value, type]
  );
}

export async function getSettingValue(key: string): Promise<string | null> {
  const setting = await getSettingByKey(key);
  return setting?.value ?? null;
}

/**
 * Returns a typed map of all settings in a group.
 */
export async function getSettingsMap(group?: string): Promise<Record<string, string>> {
  const settings = group ? await getSettingsByGroup(group) : await getAllSettings();
  return Object.fromEntries(
    settings.map((s) => [s.key, s.value ?? ''])
  );
}
