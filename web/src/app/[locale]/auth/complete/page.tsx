'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { completeMagicLink, isMagicLink } from '@/components/layout/auth-client'
import { refreshSessionUser } from '@/components/layout/use-session-user'

export default function AuthCompletePage() {
  const t = useTranslations('common')
  const router = useRouter()
  const [status, setStatus] = useState<'working' | 'need-email' | 'error'>(
    'working',
  )
  const [email, setEmail] = useState('')
  const ran = useRef(false)

  const finish = async (emailOverride?: string) => {
    try {
      await completeMagicLink(window.location.href, emailOverride)
      refreshSessionUser()
      router.replace('/')
      router.refresh()
    } catch (error) {
      if (error instanceof Error && error.message === 'missing-email') {
        setStatus('need-email')
      } else {
        setStatus('error')
      }
    }
  }

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    if (!isMagicLink(window.location.href)) {
      router.replace('/')
      return
    }
    void finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4 text-center">
        {status === 'working' && <p>{t('login')}…</p>}
        {status === 'need-email' && (
          <>
            <Label htmlFor="confirm-email">{t('email')}</Label>
            <Input
              id="confirm-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" onClick={() => finish(email)}>
              {t('login')}
            </Button>
          </>
        )}
        {status === 'error' && <p>{t('failedToSendEmail', { msg: '' })}</p>}
      </div>
    </main>
  )
}
