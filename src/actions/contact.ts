'use server'

import { contactSchema, type ContactInput } from '@/lib/validation/contact'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
import ContactAckEmail from '../../emails/contact-ack'
import ContactInternalEmail from '../../emails/contact-internal'

export async function sendContactMessage(
  input: ContactInput,
): Promise<{ ok: boolean }> {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) return { ok: false }
  const { name, email, subject, message } = parsed.data

  try {
    await Promise.all([
      sendEmail({
        to: email,
        subject: 'Hey Explorer',
        react: ContactAckEmail({ name, subject, message }),
      }),
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `New Message: ${subject}`,
        react: ContactInternalEmail({ name, email, subject, message }),
      }),
    ])
    return { ok: true }
  } catch (error) {
    console.error('contact send failed', error)
    return { ok: false }
  }
}
