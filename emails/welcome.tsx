import { Link, Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'

export default function WelcomeEmail() {
  return (
    <EmailShell preview="Welcome to Omanosaura!">
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        Welcome New Explorer!
      </Text>
      <Text>
        We are excited to have you on board with Omanosaura, please check out
        all the experiences we offer:{' '}
        <Link href="https://omanosaura.com/experiences">
          omanosaura.com/experiences
        </Link>
      </Text>
      <Text>
        Before booking anything we recommend updating your personal information
        on your <Link href="https://omanosaura.com/profile">profile</Link> so we
        can reach you more easily.
      </Text>
      <Text>
        If you have any queries feel free to contact us at{' '}
        <Link href="mailto:admin@omanosaura.com">admin@omanosaura.com</Link>, or
        follow us on{' '}
        <Link href="https://www.instagram.com/omanosaura/">Instagram</Link> to
        stay updated.
      </Text>
      <Text>Regards,</Text>
      <Text>Omanosaura Team</Text>
    </EmailShell>
  )
}
