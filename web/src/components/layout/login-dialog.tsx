'use client'

import { useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  loginWithFacebook,
  loginWithGoogle,
  sendMagicLink,
} from './auth-client'
import { refreshSessionUser } from './use-session-user'

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 488 512" aria-hidden>
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="size-4" viewBox="0 0 320 512" aria-hidden>
      <path
        fill="currentColor"
        d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
      />
    </svg>
  )
}

export function LoginDialog() {
  const t = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  const open = searchParams.get('login') === '1'

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    params.delete('login')
    const query = params.toString()
    router.replace((query ? `${pathname}?${query}` : pathname) as never)
  }, [router, pathname, searchParams])

  const onLoggedIn = useCallback(() => {
    refreshSessionUser()
    close()
    router.refresh()
  }, [close, router])

  const social = async (fn: () => Promise<void>) => {
    setBusy(true)
    try {
      await fn()
      onLoggedIn()
    } catch (error) {
      toast.warning(t('failedToSocialLogin', { msg: String(error) }))
    } finally {
      setBusy(false)
    }
  }

  const magicLink = async () => {
    setBusy(true)
    try {
      await sendMagicLink(email)
      toast.success(t('checkEmail'))
      close()
    } catch (error) {
      toast.warning(t('failedToSendEmail', { msg: String(error) }))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('login')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label htmlFor="login-email">{t('email')}</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
          />
          <Button onClick={magicLink} disabled={busy || !email}>
            {t('emailLogin')}
          </Button>
          <div className="flex items-center gap-3 py-1">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-sm">
              {t('orSocialLogin')}
            </span>
            <Separator className="flex-1" />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={busy}
              onClick={() => social(loginWithGoogle)}
            >
              <GoogleIcon /> Google
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={busy}
              onClick={() => social(loginWithFacebook)}
            >
              <FacebookIcon /> Facebook
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
