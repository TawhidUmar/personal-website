'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import { upsertSetting } from '@/lib/repositories/settings.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';
import type { SettingType } from '@/types/db.types';

export async function updateSettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const entries: { key: string; value: string; type: SettingType; group: string }[] = [];

  // Iterate over formData entries
  for (const [rawKey, rawValue] of formData.entries()) {
    if (rawKey.startsWith('setting__')) {
      // Format: setting__<group>__<type>__<key>
      const parts = rawKey.split('__');
      if (parts.length >= 4) {
        const group = parts[1];
        const type = parts[2] as SettingType;
        const key = parts.slice(3).join('__');
        entries.push({
          key,
          value: String(rawValue),
          type,
          group,
        });
      }
    }
  }

  try {
    for (const item of entries) {
      await upsertSetting(item.key, item.value, item.type, item.group);
    }

    await createAuditLog({
      userId: admin.id,
      action: 'settings.updated',
      entityType: 'settings',
      newValues: { updated_keys: entries.map((e) => e.key) },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/research');
    revalidatePath('/projects');
    revalidatePath('/articles');
    revalidatePath('/experience');
    revalidatePath('/education');
    revalidatePath('/skills');
    revalidatePath('/contact');
    revalidatePath('/admin/settings');

    return { status: 'success', message: 'System settings saved successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to update system settings.' };
  }
}
