import { Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'

export default function ContactInternalEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  return (
    <EmailShell preview={`New message from ${name}`}>
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        New Contact Message
      </Text>
      <Text>
        <b>From:</b> {name} ({email})
      </Text>
      <Text>
        <b>Subject:</b> {subject}
      </Text>
      <Text>
        <b>Message:</b> {message}
      </Text>
    </EmailShell>
  )
}
