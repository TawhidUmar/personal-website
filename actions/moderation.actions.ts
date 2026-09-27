'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import {
  updateCommentStatus,
  deleteComment,
} from '@/lib/repositories/comments.repository';
import {
  updateMessageStatus,
  deleteContactMessage,
} from '@/lib/repositories/contact.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';
import type { CommentStatus, MessageStatus } from '@/types/db.types';

export async function updateCommentStatusAction(
  commentId: number,
  status: CommentStatus
): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await updateCommentStatus(commentId, status);
    await createAuditLog({
      userId: admin.id,
      action: 'comment.status_updated',
      entityType: 'comment',
      entityId: commentId,
      newValues: { status },
    });

    revalidatePath('/articles');
    revalidatePath('/admin/comments');

    return { status: 'success', message: `Comment status updated to ${status}.` };
  } catch {
    return { status: 'error', error: 'Failed to update comment status.' };
  }
}

export async function deleteCommentAction(commentId: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteComment(commentId);
    await createAuditLog({
      userId: admin.id,
      action: 'comment.deleted',
      entityType: 'comment',
      entityId: commentId,
    });

    revalidatePath('/articles');
    revalidatePath('/admin/comments');

    return { status: 'success', message: 'Comment deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete comment.' };
  }
}

export async function updateMessageStatusAction(
  messageId: number,
  status: MessageStatus
): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await updateMessageStatus(messageId, status);
    await createAuditLog({
      userId: admin.id,
      action: 'message.status_updated',
      entityType: 'contact_message',
      entityId: messageId,
      newValues: { status },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/messages');

    return { status: 'success', message: `Message marked as ${status}.` };
  } catch {
    return { status: 'error', error: 'Failed to update message status.' };
  }
}

export async function deleteMessageAction(messageId: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteContactMessage(messageId);
    await createAuditLog({
      userId: admin.id,
      action: 'message.deleted',
      entityType: 'contact_message',
      entityId: messageId,
    });

    revalidatePath('/admin');
    revalidatePath('/admin/messages');

    return { status: 'success', message: 'Message deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete message.' };
  }
}
