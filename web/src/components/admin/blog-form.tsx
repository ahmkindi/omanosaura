'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/navigation'
import {
  deleteBlog,
  upsertBlog,
  type BlogFormInput,
} from '@/actions/admin/blogs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { TiptapEditor } from './tiptap-editor'

const EMPTY: BlogFormInput = {
  id: undefined,
  title: '',
  titleAr: '',
  description: '',
  descriptionAr: '',
  photo: '',
  page: '',
  pageAr: '',
}

export function BlogForm({ initial }: { initial?: BlogFormInput }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState<BlogFormInput>(initial ?? EMPTY)

  const set = <K extends keyof BlogFormInput>(key: K, value: BlogFormInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const submit = async () => {
    setBusy(true)
    const result = await upsertBlog(form)
    setBusy(false)
    if (result.ok) {
      toast.success('Saved')
      router.push('/admin/blogs' as never)
      router.refresh()
    } else {
      toast.error(result.error ?? 'Failed')
    }
  }

  const remove = async () => {
    if (!form.id || !confirm('Delete this blog?')) return
    setBusy(true)
    await deleteBlog(form.id)
    setBusy(false)
    router.push('/admin/blogs' as never)
    router.refresh()
  }

  return (
    <div className="max-w-3xl space-y-6" dir="ltr">
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Title (EN)</FieldLabel>
            <Input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              disabled={!!form.id}
            />
          </Field>
          <Field>
            <FieldLabel>Title (AR)</FieldLabel>
            <Input
              dir="rtl"
              value={form.titleAr}
              onChange={(e) => set('titleAr', e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Description (EN)</FieldLabel>
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Description (AR)</FieldLabel>
            <Textarea
              dir="rtl"
              rows={2}
              value={form.descriptionAr}
              onChange={(e) => set('descriptionAr', e.target.value)}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Cover Photo URL</FieldLabel>
          <Input
            value={form.photo}
            onChange={(e) => set('photo', e.target.value)}
            placeholder="https://…"
          />
        </Field>
        <Field>
          <FieldLabel>Content (EN)</FieldLabel>
          <TiptapEditor value={form.page} onChange={(v) => set('page', v)} />
        </Field>
        <Field>
          <FieldLabel>Content (AR)</FieldLabel>
          <TiptapEditor
            dir="rtl"
            value={form.pageAr}
            onChange={(v) => set('pageAr', v)}
          />
        </Field>
        <div className="flex gap-2">
          <Button onClick={submit} disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />} Save
          </Button>
          {form.id && (
            <Button variant="destructive" onClick={remove} disabled={busy}>
              Delete
            </Button>
          )}
        </div>
      </FieldGroup>
    </div>
  )
}
