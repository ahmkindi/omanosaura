'use client'

import { useState } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/navigation'
import {
  deleteProduct,
  upsertProduct,
  type ProductFormInput,
} from '@/actions/admin/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TiptapEditor } from './tiptap-editor'

type FormState = Omit<ProductFormInput, 'basePriceBaisa' | 'extraPriceBaisa'> & {
  basePriceOMR: string
  extraPriceOMR: string
}

const EMPTY: FormState = {
  id: undefined,
  kind: 'exp',
  title: '',
  titleAr: '',
  subtitle: '',
  subtitleAr: '',
  description: '',
  descriptionAr: '',
  photo: '',
  photos: [],
  basePriceOMR: '',
  extraPriceOMR: '0',
  pricePer: 4,
  plannedDates: [],
  longitude: 57.5,
  latitude: 21.5,
}

export function ProductForm({ initial }: { initial?: ProductFormInput }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          ...initial,
          basePriceOMR: (initial.basePriceBaisa / 1000).toString(),
          extraPriceOMR: (initial.extraPriceBaisa / 1000).toString(),
        }
      : EMPTY,
  )

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const submit = async () => {
    setBusy(true)
    const result = await upsertProduct({
      ...form,
      basePriceBaisa: Math.round(Number(form.basePriceOMR || 0) * 1000),
      extraPriceBaisa: Math.round(Number(form.extraPriceOMR || 0) * 1000),
      photos: form.photos.filter(Boolean),
      plannedDates: form.plannedDates.filter(Boolean),
    })
    setBusy(false)
    if (result.ok) {
      toast.success('Saved')
      router.push(`/admin/experiences` as never)
      router.refresh()
    } else {
      toast.error(result.error ?? 'Failed')
    }
  }

  const remove = async () => {
    if (!form.id || !confirm('Delete this experience?')) return
    setBusy(true)
    await deleteProduct(form.id)
    setBusy(false)
    router.push(`/admin/experiences` as never)
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
            <FieldLabel>Subtitle (EN)</FieldLabel>
            <Textarea
              rows={2}
              value={form.subtitle}
              onChange={(e) => set('subtitle', e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Subtitle (AR)</FieldLabel>
            <Textarea
              dir="rtl"
              rows={2}
              value={form.subtitleAr}
              onChange={(e) => set('subtitleAr', e.target.value)}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Description (EN)</FieldLabel>
          <TiptapEditor
            value={form.description}
            onChange={(v) => set('description', v)}
          />
        </Field>
        <Field>
          <FieldLabel>Description (AR)</FieldLabel>
          <TiptapEditor
            dir="rtl"
            value={form.descriptionAr}
            onChange={(v) => set('descriptionAr', v)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Kind</FieldLabel>
            <Select
              value={form.kind}
              onValueChange={(v) => set('kind', v as FormState['kind'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exp">Adventures & Trips</SelectItem>
                <SelectItem value="team">Team Building</SelectItem>
                <SelectItem value="school">School Trips</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Main Photo URL</FieldLabel>
            <Input
              value={form.photo}
              onChange={(e) => set('photo', e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <Field>
            <FieldLabel>Base Price (OMR, per group)</FieldLabel>
            <Input
              type="number"
              step="0.001"
              value={form.basePriceOMR}
              onChange={(e) => set('basePriceOMR', e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Extra Price (OMR, per person)</FieldLabel>
            <Input
              type="number"
              step="0.001"
              value={form.extraPriceOMR}
              onChange={(e) => set('extraPriceOMR', e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Group Size (price per N people)</FieldLabel>
            <Input
              type="number"
              min={1}
              value={form.pricePer}
              onChange={(e) => set('pricePer', Number(e.target.value) || 1)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field>
              <FieldLabel>Latitude</FieldLabel>
              <Input
                type="number"
                step="0.001"
                value={form.latitude}
                onChange={(e) => set('latitude', Number(e.target.value))}
              />
            </Field>
            <Field>
              <FieldLabel>Longitude</FieldLabel>
              <Input
                type="number"
                step="0.001"
                value={form.longitude}
                onChange={(e) => set('longitude', Number(e.target.value))}
              />
            </Field>
          </div>
        </div>

        <Field>
          <FieldLabel>Gallery Photos</FieldLabel>
          <div className="space-y-2">
            {form.photos.map((url, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) =>
                    set(
                      'photos',
                      form.photos.map((p, j) => (j === i ? e.target.value : p)),
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    set('photos', form.photos.filter((_, j) => j !== i))
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set('photos', [...form.photos, ''])}
            >
              <Plus className="size-4" /> Photo
            </Button>
          </div>
        </Field>

        <Field>
          <FieldLabel>Planned (Shared) Dates</FieldLabel>
          <div className="space-y-2">
            {form.plannedDates.map((d, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  type="date"
                  value={d}
                  onChange={(e) =>
                    set(
                      'plannedDates',
                      form.plannedDates.map((p, j) =>
                        j === i ? e.target.value : p,
                      ),
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    set(
                      'plannedDates',
                      form.plannedDates.filter((_, j) => j !== i),
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set('plannedDates', [...form.plannedDates, ''])}
            >
              <Plus className="size-4" /> Date
            </Button>
          </div>
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
