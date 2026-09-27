'use server';

import { headers } from 'next/headers';
import { contactSchema } from '@/lib/validations/contact.schema';
import { createContactMessage } from '@/lib/repositories/contact.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import { rateLimit } from '@/lib/utils/rate-limiter';
import type { ActionState } from '@/types/api.types';

export async function submitContactAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown';

  // Rate limit: 4 messages per hour per IP
  const rl = rateLimit(`contact:${ip}`, { limit: 4, windowMs: 60 * 60 * 1000 });
  if (!rl.success) {
    return {
      status: 'error',
      error: 'Too many messages sent. Please wait before submitting again.',
    };
  }

  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please correct the errors in the form.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const id = await createContactMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      ipAddress: ip,
      userAgent: headersList.get('user-agent') ?? undefined,
    });

    await createAuditLog({
      action: 'contact.message.received',
      entityType: 'contact_message',
      entityId: id,
      ipAddress: ip,
      newValues: { email: parsed.data.email, subject: parsed.data.subject },
    });

    return {
      status: 'success',
      message: 'Thank you! Your message has been transmitted successfully. I will get back to you soon.',
    };
  } catch {
    return {
      status: 'error',
      error: 'A database error occurred while sending your message. Please try again later.',
    };
  }
}
