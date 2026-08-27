import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { ReactNode } from 'react'

export const BRAND_PRIMARY = '#043c6c'
export const BRAND_SECONDARY = '#f58a07'

export function EmailShell({
  preview,
  children,
}: {
  preview: string
  children: ReactNode
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: '#f4f6f8', fontFamily: 'Arial, sans-serif' }}>
        <Container
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 8,
            margin: '24px auto',
            padding: 24,
            maxWidth: 560,
          }}
        >
          <Section style={{ textAlign: 'center', marginBottom: 16 }}>
            <Img
              src="https://omanosaura.com/main_logo.png"
              alt="Omanosaura"
              width={180}
              style={{ margin: '0 auto' }}
            />
          </Section>
          {children}
          <Text style={{ color: '#8898aa', fontSize: 12, marginTop: 24 }}>
            Omanosaura Team — admin@omanosaura.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
