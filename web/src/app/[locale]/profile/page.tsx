import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from '@/i18n/navigation'
import { ProfileForm } from '@/components/profile-form'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const user = await getCurrentUser()
  if (!user) redirect({ href: '/?login=1', locale })

  const t = await getTranslations('profile')

  return (
    <main className="mx-auto max-w-lg space-y-8 px-4 py-12">
      <h1 className="text-3xl font-bold">{t('title').split('|')[0]}</h1>
      <ProfileForm
        initial={{ name: user!.name, phone: user!.phone, email: user!.email }}
      />
    </main>
  )
}
