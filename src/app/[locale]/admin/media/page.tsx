import { MediaManager } from '@/components/admin/media-manager'

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" dir="ltr">
        Media
      </h1>
      <MediaManager />
    </div>
  )
}
