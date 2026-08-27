import { getAllUsers } from '@/data/users'
import { UsersTable } from '@/components/admin/users-table'

export default async function AdminUsersPage() {
  const users = await getAllUsers()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" dir="ltr">
        Users
      </h1>
      <UsersTable users={users} />
    </div>
  )
}
