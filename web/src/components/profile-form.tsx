'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { updateProfile } from '@/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

const schema = z.object({
  name: z.string().min(2).max(200),
  phone: z.string().min(3).max(30),
})

type FormValues = z.infer<typeof schema>

export function ProfileForm({
  initial,
}: {
  initial: { name: string; phone: string; email: string }
}) {
  const t = useTranslations('profile')
  const [busy, setBusy] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: initial.name, phone: initial.phone },
  })

  const onSubmit = async (values: FormValues) => {
    setBusy(true)
    const result = await updateProfile(values)
    setBusy(false)
    if (result.ok) toast.success(t('successUpdate'))
    else toast.error(t('failedUpdate'))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>{t('emailAdr')}</FieldLabel>
          <Input value={initial.email} disabled />
        </Field>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="pf-name">{t('name')}</FieldLabel>
          <Input id="pf-name" {...register('name')} />
          {errors.name && <FieldError>{t('tooShort')}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="pf-phone">{t('phone')}</FieldLabel>
          <Input id="pf-phone" type="tel" dir="ltr" {...register('phone')} />
          {errors.phone && <FieldError>{t('tooShort')}</FieldError>}
        </Field>
        <Button type="submit" disabled={busy}>
          {t('update')}
        </Button>
      </FieldGroup>
    </form>
  )
}
