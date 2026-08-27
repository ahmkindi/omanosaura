import { Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'

export default function ContactAckEmail({
  name,
  subject,
  message,
}: {
  name: string
  subject: string
  message: string
}) {
  return (
    <EmailShell preview="We received your message">
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        Hey {name}
      </Text>
      <Text>We received your following message:</Text>
      <Text>
        <b>Subject:</b> {subject}
      </Text>
      <Text>
        <b>Message:</b> {message}
      </Text>
      <Text>We will get back to you soon!</Text>
      <Text>Omanosaura Team</Text>
    </EmailShell>
  )
}
