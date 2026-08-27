'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { setUserRole } from '@/actions/admin/users'
import type { AdminUserDTO } from '@/data/users'
import { exportCSV } from '@/lib/csv'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function UsersTable({ users }: { users: AdminUserDTO[] }) {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState(users)

  const visible = rows.filter((u) =>
    `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(query.toLowerCase()),
  )

  const changeRole = async (userId: string, role: AdminUserDTO['role']) => {
    const result = await setUserRole(userId, role)
    if (result.ok) {
      setRows((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u)),
      )
      toast.success('Role updated')
    } else {
      toast.error('Failed to update role')
    }
  }

  return (
    <div className="space-y-4" dir="ltr">
      <div className="flex gap-2">
        <Input
          placeholder="Search users…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() =>
            exportCSV(
              'users.csv',
              visible.map((u) => ({
                name: u.name,
                email: u.email,
                phone: u.phone,
                role: u.role,
                avgRating: u.avgRating ?? '',
                lastTrip: u.lastTrip ?? '',
                purchases: u.purchaseCount,
              })),
            )
          }
        >
          <Download className="size-4" /> Export
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Avg Rating</TableHead>
            <TableHead>Last Trip</TableHead>
            <TableHead>Purchases</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell dir="ltr">{u.phone}</TableCell>
              <TableCell>
                <Select
                  value={u.role}
                  onValueChange={(v) =>
                    changeRole(u.id, v as AdminUserDTO['role'])
                  }
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">none</SelectItem>
                    <SelectItem value="writer">writer</SelectItem>
                    <SelectItem value="admin">admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{u.avgRating?.toFixed(1) ?? '—'}</TableCell>
              <TableCell>{u.lastTrip ?? '—'}</TableCell>
              <TableCell>{u.purchaseCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
