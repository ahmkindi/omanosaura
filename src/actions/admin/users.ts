'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function setUserRole(
  userId: string,
  role: 'none' | 'admin' | 'writer',
): Promise<{ ok: boolean }> {
  try {
    await requireRole('admin')
  } catch {
    return { ok: false }
  }
  const parsed = z
    .object({
      userId: z.string().min(1),
      role: z.enum(['none', 'admin', 'writer']),
    })
    .safeParse({ userId, role })
  if (!parsed.success) return { ok: false }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  })
  return { ok: true }
}
