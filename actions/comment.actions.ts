'use server';

import { headers } from 'next/headers';
import { commentSchema } from '@/lib/validations/comment.schema';
import { createComment } from '@/lib/repositories/comments.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import { rateLimit } from '@/lib/utils/rate-limiter';
import type { ActionState } from '@/types/api.types';

export async function submitCommentAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown';

  // Rate limit: 5 comments per 15 minutes per IP
  const rl = rateLimit(`comment:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rl.success) {
    return {
      status: 'error',
      error: 'You are submitting comments too frequently. Please wait a few moments.',
    };
  }

  const raw = {
    articleId: formData.get('articleId'),
    parentId: formData.get('parentId') || undefined,
    authorName: formData.get('authorName') as string,
    authorEmail: formData.get('authorEmail') as string,
    content: formData.get('content') as string,
  };

  const parsed = commentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please verify the comment fields.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const id = await createComment({
      articleId: parsed.data.articleId,
      parentId: parsed.data.parentId ?? undefined,
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail,
      content: parsed.data.content,
      ipAddress: ip,
      userAgent: headersList.get('user-agent') ?? undefined,
      status: 'pending',
    });

    await createAuditLog({
      action: 'comment.created.pending',
      entityType: 'comment',
      entityId: id,
      ipAddress: ip,
      newValues: { articleId: parsed.data.articleId, authorEmail: parsed.data.authorEmail },
    });

    return {
      status: 'success',
      message: 'Comment submitted successfully! It will become visible once reviewed by the administrator.',
    };
  } catch {
    return {
      status: 'error',
      error: 'Failed to submit comment. Please try again later.',
    };
  }
}
