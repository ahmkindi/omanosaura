'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  deleteReview,
  fetchReviews,
  getMyReview,
  upsertReview,
} from '@/actions/reviews'
import type { ReviewDTO } from '@/data/reviews'
import { useSessionUser } from '@/components/layout/use-session-user'
import { StarRating } from '@/components/star-rating'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const PAGE_SIZE = 10

function StarPicker({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <Star
            className={
              n <= value
                ? 'size-6 fill-(--color-secondary) text-(--color-secondary)'
                : 'text-muted-foreground/40 size-6'
            }
          />
        </button>
      ))}
    </div>
  )
}

export function ReviewsSection({
  productId,
  initialReviews,
  total,
}: {
  productId: string
  initialReviews: ReviewDTO[]
  total?: number
}) {
  const t = useTranslations('experiences')
  const { user } = useSessionUser()

  const [reviews, setReviews] = useState(initialReviews)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialReviews.length === PAGE_SIZE)
  const [busy, setBusy] = useState(false)
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [review, setReview] = useState('')
  const [hadReview, setHadReview] = useState(false)

  useEffect(() => {
    if (!user) return
    void getMyReview(productId).then((mine) => {
      if (mine) {
        setRating(mine.rating)
        setTitle(mine.title)
        setReview(mine.review)
        setHadReview(true)
      }
    })
  }, [user, productId])

  const loadMore = useCallback(async () => {
    // The ref (not `busy`) is the reentrancy guard: the IntersectionObserver
    // can fire again before React commits the state update.
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setBusy(true)
    try {
      const next = await fetchReviews(productId, page + 1)
      setReviews((prev) => [...prev, ...next])
      setPage((p) => p + 1)
      setHasMore(next.length === PAGE_SIZE)
    } finally {
      loadingRef.current = false
      setBusy(false)
    }
  }, [productId, page, hasMore])

  // Infinite loading: fetch the next page when the sentinel under the list
  // scrolls into view. The Load More button stays as a no-JS-quirk fallback.
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void loadMore()
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  const resetList = async () => {
    const first = await fetchReviews(productId, 1)
    setReviews(first)
    setPage(1)
    setHasMore(first.length === PAGE_SIZE)
  }

  const submit = async () => {
    setBusy(true)
    const result = await upsertReview({ productId, rating, title, review })
    if (result.ok) {
      toast.success(t('successfulReview'))
      setHadReview(true)
      await resetList()
    } else {
      toast.error(
        result.error === 'profane' ? t('reviewRejected') : t('failedReview'),
      )
    }
    setBusy(false)
  }

  const remove = async () => {
    setBusy(true)
    await deleteReview(productId)
    setRating(0)
    setTitle('')
    setReview('')
    setHadReview(false)
    await resetList()
    setBusy(false)
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">
        {t('reviews')}
        {typeof total === 'number' && total > 0 && (
          <span className="text-muted-foreground ms-2 text-base font-normal">
            ({total})
          </span>
        )}
      </h2>

      {user && (
        <Card>
          <CardContent className="space-y-3">
            <Label>{t('addReview')}</Label>
            <StarPicker value={rating} onChange={setRating} />
            <Input
              placeholder={t('reviewTitle')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder={t('reviewDesc')}
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={submit} disabled={busy || rating === 0}>
                {t('submit')}
              </Button>
              {hadReview && (
                <Button variant="destructive" onClick={remove} disabled={busy}>
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 && (
        <p className="text-muted-foreground rounded-2xl border border-dashed px-6 py-10 text-center text-sm">
          {t('noReviews')}
        </p>
      )}

      <div className="space-y-4">
        {reviews.map((r) => (
          <Card key={`${r.productId}-${r.userId}`}>
            <CardContent className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">
                  {t('userReview', { name: r.userName })}
                </p>
                <StarRating rating={r.rating} />
              </div>
              {r.title && <p className="font-semibold">{r.title}</p>}
              {r.review && (
                <p className="text-muted-foreground text-sm">{r.review}</p>
              )}
              <p className="text-muted-foreground text-xs">{r.lastUpdated}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <>
          <div ref={sentinelRef} aria-hidden className="h-px" />
          <Button variant="outline" onClick={loadMore} disabled={busy}>
            {t('loadMore')}
          </Button>
        </>
      )}
    </section>
  )
}
