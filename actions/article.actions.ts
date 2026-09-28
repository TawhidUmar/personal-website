'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import { articleSchema } from '@/lib/validations/article.schema';
import {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleById,
  toggleArticleFeatured,
} from '@/lib/repositories/articles.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import { estimateReadingTime } from '@/lib/utils/slugify';
import type { ActionState } from '@/types/api.types';
import type { ArticleStatus } from '@/types/db.types';

export async function createArticleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const tagIdsRaw = formData.getAll('tagIds');
  const tagIds = tagIdsRaw.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0);

  const raw = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: (formData.get('excerpt') as string) || undefined,
    content: formData.get('content') as string,
    categoryId: formData.get('categoryId') || undefined,
    coverImageUrl: (formData.get('coverImageUrl') as string) || undefined,
    status: (formData.get('status') as ArticleStatus) || 'draft',
    readingTime: formData.get('readingTime')
      ? Number(formData.get('readingTime'))
      : undefined,
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    tagIds,
    seoTitle: (formData.get('seoTitle') as string) || undefined,
    seoDescription: (formData.get('seoDescription') as string) || undefined,
    canonicalUrl: (formData.get('canonicalUrl') as string) || undefined,
  };

  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix the validation errors below.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const readingTime = parsed.data.readingTime ?? estimateReadingTime(parsed.data.content);
  const publishedAt = parsed.data.status === 'published' ? new Date() : null;

  try {
    const articleId = await createArticle(
      {
        author_id: admin.id,
        category_id: parsed.data.categoryId ?? null,
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt ?? null,
        content: parsed.data.content,
        cover_image_url: parsed.data.coverImageUrl || null,
        status: parsed.data.status,
        reading_time: readingTime,
        is_featured: parsed.data.isFeatured,
        published_at: publishedAt,
        scheduled_at: null,
        seo_title: parsed.data.seoTitle ?? null,
        seo_description: parsed.data.seoDescription ?? null,
        canonical_url: parsed.data.canonicalUrl || null,
      },
      tagIds
    );

    await createAuditLog({
      userId: admin.id,
      action: 'article.created',
      entityType: 'article',
      entityId: articleId,
      newValues: { title: parsed.data.title, status: parsed.data.status },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/articles/[slug]', 'page');
    revalidatePath(`/articles/${parsed.data.slug}`);
    revalidatePath('/admin/articles');
    revalidatePath('/admin');

    return {
      status: 'success',
      message: 'Article created successfully!',
      data: { articleId },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[createArticleAction] Error:', errorMsg);
    if (errorMsg.includes('Duplicate entry')) {
      return { status: 'error', error: 'An article with this slug already exists. Please choose a unique slug.' };
    }
    // Surface the real DB error so it can be diagnosed
    return { status: 'error', error: `DB error: ${errorMsg}` };
  }
}

export async function updateArticleAction(
  articleId: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const tagIdsRaw = formData.getAll('tagIds');
  const tagIds = tagIdsRaw.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0);

  const raw = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: (formData.get('excerpt') as string) || undefined,
    content: formData.get('content') as string,
    categoryId: formData.get('categoryId') || undefined,
    coverImageUrl: (formData.get('coverImageUrl') as string) || undefined,
    status: (formData.get('status') as ArticleStatus) || 'draft',
    readingTime: formData.get('readingTime')
      ? Number(formData.get('readingTime'))
      : undefined,
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    tagIds,
    seoTitle: (formData.get('seoTitle') as string) || undefined,
    seoDescription: (formData.get('seoDescription') as string) || undefined,
    canonicalUrl: (formData.get('canonicalUrl') as string) || undefined,
  };

  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix the validation errors below.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const existing = await getArticleById(articleId);
  if (!existing) {
    return { status: 'error', error: 'Article not found.' };
  }

  const readingTime = parsed.data.readingTime ?? estimateReadingTime(parsed.data.content);
  const publishedAt =
    parsed.data.status === 'published' && !existing.published_at
      ? new Date()
      : existing.published_at;

  try {
    await updateArticle(
      articleId,
      {
        category_id: parsed.data.categoryId ?? null,
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt ?? null,
        content: parsed.data.content,
        cover_image_url: parsed.data.coverImageUrl || null,
        status: parsed.data.status,
        reading_time: readingTime,
        is_featured: parsed.data.isFeatured,
        published_at: publishedAt,
        seo_title: parsed.data.seoTitle ?? null,
        seo_description: parsed.data.seoDescription ?? null,
        canonical_url: parsed.data.canonicalUrl || null,
      },
      tagIds
    );

    await createAuditLog({
      userId: admin.id,
      action: 'article.updated',
      entityType: 'article',
      entityId: articleId,
      oldValues: { title: existing.title, status: existing.status },
      newValues: { title: parsed.data.title, status: parsed.data.status },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/articles/[slug]', 'page');
    revalidatePath(`/articles/${parsed.data.slug}`);
    if (existing.slug !== parsed.data.slug) {
      revalidatePath(`/articles/${existing.slug}`);
    }
    revalidatePath('/admin/articles');
    revalidatePath(`/admin/articles/${articleId}/edit`);
    revalidatePath('/admin');

    return {
      status: 'success',
      message: 'Article updated successfully!',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database error';
    return {
      status: 'error',
      error: errorMsg.includes('Duplicate entry')
        ? 'An article with this slug already exists.'
        : 'Failed to update article.',
    };
  }
}

export async function deleteArticleAction(articleId: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    const existing = await getArticleById(articleId);
    if (!existing) {
      return { status: 'error', error: 'Article not found.' };
    }

    await deleteArticle(articleId);

    await createAuditLog({
      userId: admin.id,
      action: 'article.deleted',
      entityType: 'article',
      entityId: articleId,
      oldValues: { title: existing.title },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/articles/[slug]', 'page');
    revalidatePath(`/articles/${existing.slug}`);
    revalidatePath('/admin/articles');
    revalidatePath('/admin');

    return { status: 'success', message: 'Article deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete article.' };
  }
}

export async function toggleArticleStatusAction(
  articleId: number,
  newStatus: ArticleStatus
): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    const existing = await getArticleById(articleId);
    if (!existing) {
      return { status: 'error', error: 'Article not found.' };
    }

    const publishedAt =
      newStatus === 'published' && !existing.published_at
        ? new Date()
        : existing.published_at;

    await updateArticle(articleId, {
      status: newStatus,
      published_at: publishedAt,
    });

    await createAuditLog({
      userId: admin.id,
      action: `article.status.${newStatus}`,
      entityType: 'article',
      entityId: articleId,
      oldValues: { status: existing.status },
      newValues: { status: newStatus },
    });

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath(`/articles/${existing.slug}`);
    revalidatePath('/admin/articles');

    return {
      status: 'success',
      message: `Article status changed to ${newStatus}.`,
    };
  } catch {
    return { status: 'error', error: 'Failed to update article status.' };
  }
}

export async function toggleArticleFeaturedAction(
  articleId: number
): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    const isNowFeatured = await toggleArticleFeatured(articleId);

    await createAuditLog({
      userId: admin.id,
      action: isNowFeatured ? 'article.featured' : 'article.unfeatured',
      entityType: 'article',
      entityId: articleId,
      newValues: { is_featured: isNowFeatured },
    });

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin/articles');

    return {
      status: 'success',
      message: isNowFeatured
        ? 'Article is now featured on the homepage!'
        : 'Article unfeatured from homepage.',
    };
  } catch {
    return { status: 'error', error: 'Failed to toggle featured status.' };
  }
}
