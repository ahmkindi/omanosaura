'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { adminAuth } from '@/lib/firebase/admin'

const profileSchema = z.object({
  name: z.string().min(2).max(200),
  phone: z.string().min(3).max(30),
})

export type ProfileInput = z.infer<typeof profileSchema>

export async function updateProfile(
  input: ProfileInput,
): Promise<{ ok: boolean }> {
  let user
  try {
    user = await requireUser()
  } catch {
    return { ok: false }
  }
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) return { ok: false }

  try {
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { name: parsed.data.name, phone: parsed.data.phone },
      }),
      adminAuth().updateUser(user.id, { displayName: parsed.data.name }),
    ])
    return { ok: true }
  } catch (error) {
    console.error('profile update failed', error)
    return { ok: false }
  }
}
