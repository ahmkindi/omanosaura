import 'server-only'
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import type { ReactElement } from 'react'
import { env } from '@/env'

const FROM = process.env.EMAIL_FROM || 'Omanosaura <no-reply@mail.omanosaura.com>'
export const ADMIN_EMAIL = 'info@omanosaura.com'

function transport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false, // STARTTLS
    auth: {
      user: env.emailUsername,
      pass: env.emailPassword,
    },
  })
}

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string
  subject: string
  react: ReactElement
}) {
  const html = await render(react)
  const text = await render(react, { plainText: true })
  await transport().sendMail({ from: FROM, to, subject, html, text })
}

export async function sendWelcomeEmail(to: string) {
  if (!to) return
  const { default: WelcomeEmail } = await import('../../emails/welcome')
  await sendEmail({ to, subject: 'Welcome To Omanosaura', react: WelcomeEmail() })
}
