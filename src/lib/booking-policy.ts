// Cancellation/reschedule cutoff shared by server actions (authoritative) and
// client components (rendering only). Kept dependency-free like pricing.ts so
// both sides can import it.

/** Customers may modify a booking until this many hours before the trip day. */
export const MODIFY_CUTOFF_HOURS = 24

// Oman is fixed UTC+4 with no DST.
const MUSCAT_OFFSET_HOURS = 4
const HOUR_MS = 3_600_000

function tripDayStartUtcMs(chosenDate: string | Date): number {
  // chosenDate is a calendar date stored as midnight UTC (`@db.Date`) or a
  // 'yyyy-MM-dd' string. The trip day starts at 00:00 Asia/Muscat =
  // 20:00 UTC the previous day = the stored midnight UTC minus 4h.
  const midnightUtc =
    typeof chosenDate === 'string'
      ? Date.parse(`${chosenDate}T00:00:00Z`)
      : chosenDate.getTime()
  return midnightUtc - MUSCAT_OFFSET_HOURS * HOUR_MS
}

/** Last instant at which the booking can still be cancelled or rescheduled. */
export function modificationDeadline(chosenDate: string | Date): Date {
  return new Date(tripDayStartUtcMs(chosenDate) - MODIFY_CUTOFF_HOURS * HOUR_MS)
}

export function canModifyBooking(
  chosenDate: string | Date,
  now: Date = new Date(),
): boolean {
  return now.getTime() < modificationDeadline(chosenDate).getTime()
}
