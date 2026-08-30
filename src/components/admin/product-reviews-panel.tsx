'use client'

import { useMemo, useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/navigation'
import type { AdminReviewDTO } from '@/data/reviews'
import { adminDeleteReview } from '@/actions/admin/reviews'
import { StarRating } from '@/components/star-rating'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TablePagination } from '@/components/admin/table-pagination'

const PAGE_SIZE = 10

export function ProductReviewsPanel({
  reviews,
}: {
  reviews: AdminReviewDTO[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [minRating, setMinRating] = useState<'all' | '1' | '2' | '3' | '4' | '5'>(
    'all',
  )
  const [page, setPage] = useState(1)
  const [busy, startTransition] = useTransition()
  const [target, setTarget] = useState<AdminReviewDTO | null>(null)

  const filtered = useMemo(
    () =>
      reviews.filter((r) => {
        if (minRating !== 'all' && Math.round(r.rating) !== Number(minRating))
          return false
        return `${r.userName} ${r.userEmail} ${r.title} ${r.review}`
          .toLowerCase()
          .includes(query.toLowerCase())
      }),
    [reviews, query, minRating],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const remove = (review: AdminReviewDTO) =>
    startTransition(async () => {
      const result = await adminDeleteReview({
        productId: review.productId,
        userId: review.userId,
      })
      if (result.ok) {
        toast.success('Review deleted')
        setTarget(null)
        router.refresh()
      } else {
        toast.error('Failed to delete review')
      }
    })

  return (
    <Card dir="ltr">
      <CardHeader>
        <CardTitle>Reviews ({reviews.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search reviewer or text…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            className="max-w-xs"
          />
          <Select
            value={minRating}
            onValueChange={(v) => {
              setMinRating(v as typeof minRating)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              {['5', '4', '3', '2', '1'].map((n) => (
                <SelectItem key={n} value={n}>
                  {n} star{n === '1' ? '' : 's'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm">No reviews match.</p>
        )}

        <div className="space-y-3">
          {visible.map((r) => (
            <div
              key={`${r.productId}-${r.userId}`}
              className="flex items-start justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{r.userName}</span>
                  <span className="text-muted-foreground text-xs">
                    {r.userEmail} · {r.lastUpdated}
                  </span>
                  <StarRating rating={r.rating} />
                </div>
                {r.title && <p className="text-sm font-semibold">{r.title}</p>}
                {r.review && (
                  <p className="text-muted-foreground text-sm break-words">
                    {r.review}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive shrink-0"
                disabled={busy}
                onClick={() => setTarget(r)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <TablePagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          onPage={setPage}
        />
      </CardContent>

      <Dialog open={target !== null} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this review?</DialogTitle>
          </DialogHeader>
          {target && (
            <p className="text-muted-foreground text-sm">
              {target.userName}&apos;s {Math.round(target.rating)}-star review
              will be permanently removed and the experience rating will update.
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTarget(null)}
              disabled={busy}
            >
              Keep
            </Button>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() => target && remove(target)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
