'use client'

import { useMemo, useState } from 'react'
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
import { TablePagination } from '@/components/admin/table-pagination'

const PAGE_SIZE = 20

export function UsersTable({ users }: { users: AdminUserDTO[] }) {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<'all' | AdminUserDTO['role']>('all')
  const [hasTrips, setHasTrips] = useState<'all' | 'customers'>('all')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(users)

  const filtered = useMemo(
    () =>
      rows.filter((u) => {
        if (role !== 'all' && u.role !== role) return false
        if (hasTrips === 'customers' && u.purchaseCount === 0) return false
        return `${u.name} ${u.email} ${u.phone}`
          .toLowerCase()
          .includes(query.toLowerCase())
      }),
    [rows, query, role, hasTrips],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const setFilter = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    setPage(1)
  }

  const changeRole = async (userId: string, newRole: AdminUserDTO['role']) => {
    const result = await setUserRole(userId, newRole)
    if (result.ok) {
      setRows((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      )
      toast.success('Role updated')
    } else {
      toast.error('Failed to update role')
    }
  }

  return (
    <div className="space-y-4" dir="ltr">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search users…"
          value={query}
          onChange={(e) => setFilter(setQuery)(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={role}
          onValueChange={(v) => setFilter(setRole)(v as typeof role)}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="none">none</SelectItem>
            <SelectItem value="writer">writer</SelectItem>
            <SelectItem value="admin">admin</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={hasTrips}
          onValueChange={(v) => setFilter(setHasTrips)(v as typeof hasTrips)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All users</SelectItem>
            <SelectItem value="customers">With purchases</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() =>
            exportCSV(
              'users.csv',
              filtered.map((u) => ({
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
      <TablePagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        onPage={setPage}
      />
    </div>
  )
}
