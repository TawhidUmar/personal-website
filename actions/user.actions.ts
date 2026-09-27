'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import {
  createUser,
  updateUserActiveStatus,
  deleteUser,
} from '@/lib/repositories/users.repository';
import { hashPassword } from '@/lib/auth/password';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';

export async function createUserAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const name = (formData.get('name') as string) || '';
  const email = (formData.get('email') as string) || '';
  const password = (formData.get('password') as string) || '';
  const roleId = formData.get('roleId') ? Number(formData.get('roleId')) : 2;

  if (!name.trim() || !email.trim() || !password.trim()) {
    return { status: 'error', error: 'Name, email, and password are required.' };
  }

  if (password.length < 8) {
    return { status: 'error', error: 'Password must be at least 8 characters.' };
  }

  try {
    const passwordHash = await hashPassword(password);
    const userId = await createUser(email.trim().toLowerCase(), passwordHash, name.trim(), roleId);

    await createAuditLog({
      userId: admin.id,
      action: 'user.created',
      entityType: 'user',
      entityId: userId,
      newValues: { name, email, roleId },
    });

    revalidatePath('/admin/users');

    return { status: 'success', message: 'User created successfully!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    return {
      status: 'error',
      error: msg.includes('Duplicate') ? 'A user with this email already exists.' : 'Failed to create user.',
    };
  }
}

export async function toggleUserActiveAction(
  userId: number,
  currentStatus: boolean
): Promise<ActionState> {
  const admin = await requireAdmin();

  if (admin.id === userId) {
    return { status: 'error', error: 'You cannot deactivate your own administrative account.' };
  }

  try {
    const newStatus = !currentStatus;
    await updateUserActiveStatus(userId, newStatus);

    await createAuditLog({
      userId: admin.id,
      action: newStatus ? 'user.activated' : 'user.deactivated',
      entityType: 'user',
      entityId: userId,
    });

    revalidatePath('/admin/users');

    return { status: 'success', message: `User ${newStatus ? 'activated' : 'deactivated'}.` };
  } catch {
    return { status: 'error', error: 'Failed to update user status.' };
  }
}

export async function deleteUserAction(userId: number): Promise<ActionState> {
  const admin = await requireAdmin();

  if (admin.id === userId) {
    return { status: 'error', error: 'You cannot delete your own administrative account.' };
  }

  try {
    await deleteUser(userId);

    await createAuditLog({
      userId: admin.id,
      action: 'user.deleted',
      entityType: 'user',
      entityId: userId,
    });

    revalidatePath('/admin/users');

    return { status: 'success', message: 'User deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete user.' };
  }
}
