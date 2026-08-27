import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  return NextResponse.json({
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.role === 'admin',
        }
      : null,
  })
}
