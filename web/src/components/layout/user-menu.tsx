'use client'

import { useTranslations } from 'next-intl'
import { LogIn, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logout } from './auth-client'
import { refreshSessionUser, useSessionUser } from './use-session-user'

export function UserMenu() {
  const t = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, loading } = useSessionUser()

  if (loading) return <Skeleton className="size-8 rounded-full" />

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const params = new URLSearchParams(searchParams)
          params.set('login', '1')
          router.push(`${pathname}?${params.toString()}` as never)
        }}
      >
        <LogIn className="size-4" />
        {t('login')}
      </Button>
    )
  }

  const initials = (user.name || user.email)
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label={user.name || user.email}>
          <Avatar>
            <AvatarFallback>{initials || <UserIcon />}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="max-w-48 truncate">
          {user.name || user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">{t('profile')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/purchases">{t('purchases')}</Link>
        </DropdownMenuItem>
        {user.isAdmin && (
          <DropdownMenuItem asChild>
            <Link href={'/admin' as never}>
              <ShieldCheck className="size-4" /> Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await logout()
            refreshSessionUser()
            router.refresh()
          }}
        >
          <LogOut className="size-4" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
