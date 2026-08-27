'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { sendContactMessage } from '@/actions/contact'
import { contactSchema, type ContactInput } from '@/lib/validation/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

export function ContactForm() {
  const t = useTranslations('contact')
  const [busy, setBusy] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const onSubmit = async (values: ContactInput) => {
    setBusy(true)
    const result = await sendContactMessage(values)
    setBusy(false)
    if (result.ok) {
      toast.success(t('sent'))
      reset()
    } else {
      toast.error(t('failed'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="cf-name">{t('name')}</FieldLabel>
          <Input id="cf-name" {...register('name')} />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="cf-email">{t('email')}</FieldLabel>
          <Input id="cf-email" type="email" {...register('email')} />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.subject}>
          <FieldLabel htmlFor="cf-subject">{t('subject')}</FieldLabel>
          <Input id="cf-subject" {...register('subject')} />
          {errors.subject && <FieldError>{errors.subject.message}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.message}>
          <FieldLabel htmlFor="cf-message">{t('message')}</FieldLabel>
          <Textarea id="cf-message" rows={5} {...register('message')} />
          {errors.message && <FieldError>{errors.message.message}</FieldError>}
        </Field>
        <Button type="submit" disabled={busy} className="w-full">
          {t('send')}
        </Button>
      </FieldGroup>
    </form>
  )
}
