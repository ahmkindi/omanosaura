'use client'

import { useEffect, useState } from 'react'
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
}: {
  productId: string
  initialReviews: ReviewDTO[]
}) {
  const t = useTranslations('experiences')
  const { user } = useSessionUser()

  const [reviews, setReviews] = useState(initialReviews)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialReviews.length === PAGE_SIZE)
  const [busy, setBusy] = useState(false)

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

  const loadMore = async () => {
    setBusy(true)
    const next = await fetchReviews(productId, page + 1)
    setReviews((prev) => [...prev, ...next])
    setPage((p) => p + 1)
    setHasMore(next.length === PAGE_SIZE)
    setBusy(false)
  }

  const submit = async () => {
    setBusy(true)
    const result = await upsertReview({ productId, rating, title, review })
    setBusy(false)
    if (result.ok) {
      toast.success(t('successfulReview'))
      setHadReview(true)
      setReviews(await fetchReviews(productId, 1))
      setPage(1)
    } else {
      toast.error(t('failedReview'))
    }
  }

  const remove = async () => {
    setBusy(true)
    await deleteReview(productId)
    setBusy(false)
    setRating(0)
    setTitle('')
    setReview('')
    setHadReview(false)
    setReviews(await fetchReviews(productId, 1))
    setPage(1)
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">{t('reviews')}</h2>

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
        <Button variant="outline" onClick={loadMore} disabled={busy}>
          {t('loadMore')}
        </Button>
      )}
    </section>
  )
}
