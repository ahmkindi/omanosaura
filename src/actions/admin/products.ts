'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'

const productSchema = z.object({
  id: z.string().optional(),
  kind: z.enum(['school', 'team', 'exp']),
  title: z.string().min(1).max(200),
  titleAr: z.string().min(1).max(200),
  subtitle: z.string().min(1).max(500),
  subtitleAr: z.string().min(1).max(500),
  description: z.string().min(1),
  descriptionAr: z.string().min(1),
  photo: z.url(),
  photos: z.array(z.url()),
  basePriceBaisa: z.number().int().min(0),
  extraPriceBaisa: z.number().int().min(0),
  pricePer: z.number().int().min(1).max(1000),
  plannedDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
})

export type ProductFormInput = z.infer<typeof productSchema>

// Route-pattern form busts every locale. Literal URL paths like
// '/experiences' silently miss the default locale, whose internal cached
// path is '/en/experiences' under next-intl's as-needed prefixing.
function revalidateProducts(_id: string) {
  revalidatePath('/[locale]', 'page')
  revalidatePath('/[locale]/experiences', 'page')
  revalidatePath('/[locale]/experiences/[id]', 'page')
}

/** Legacy slug rule: lowercased title, spaces → dashes. */
function slugFromTitle(title: string): string {
  return title.toLowerCase().trim().replaceAll(' ', '-')
}

export async function upsertProduct(
  input: ProductFormInput,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    await requireRole('admin')
  } catch {
    return { ok: false, error: 'forbidden' }
  }

  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message }
  }
  const data = parsed.data
  const id = data.id || slugFromTitle(data.title)

  const values = {
    kind: data.kind,
    title: data.title,
    titleAr: data.titleAr,
    subtitle: data.subtitle,
    subtitleAr: data.subtitleAr,
    description: data.description,
    descriptionAr: data.descriptionAr,
    photo: data.photo,
    photos: data.photos,
    basePriceBaisa: BigInt(data.basePriceBaisa),
    extraPriceBaisa: BigInt(data.extraPriceBaisa),
    pricePer: data.pricePer,
    plannedDates: data.plannedDates.map((d) => new Date(`${d}T00:00:00Z`)),
    longitude: data.longitude,
    latitude: data.latitude,
    lastUpdated: new Date(),
    isDeleted: false,
  }

  await prisma.product.upsert({
    where: { id },
    update: values,
    create: { id, ...values },
  })
  revalidateProducts(id)
  return { ok: true, id }
}

export async function deleteProduct(id: string): Promise<{ ok: boolean }> {
  try {
    await requireRole('admin')
  } catch {
    return { ok: false }
  }
  await prisma.product.update({ where: { id }, data: { isDeleted: true } })
  revalidateProducts(id)
  return { ok: true }
}
