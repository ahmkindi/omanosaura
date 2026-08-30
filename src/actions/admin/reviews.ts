'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'

const deleteSchema = z.object({
  productId: z.string().min(1),
  userId: z.string().min(1),
})

export async function adminDeleteReview(input: {
  productId: string
  userId: string
}): Promise<{ ok: boolean }> {
  try {
    await requireRole('admin')
  } catch {
    return { ok: false }
  }
  const parsed = deleteSchema.safeParse(input)
  if (!parsed.success) return { ok: false }
  const { productId, userId } = parsed.data

  await prisma.review
    .delete({ where: { productId_userId: { productId, userId } } })
    .catch(() => {})

  // Route-pattern form busts every locale (literal paths miss '/en/...').
  revalidatePath('/[locale]/experiences/[id]', 'page')
  revalidatePath('/[locale]/experiences', 'page')
  revalidatePath('/[locale]/admin/experiences/[id]', 'page')
  return { ok: true }
}
