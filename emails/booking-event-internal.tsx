import { Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'

export type BookingEventInternalProps = {
  event: 'cancelled' | 'rescheduled'
  purchaseId: string
  productTitle: string
  customerName: string
  customerEmail: string
  chosenDate: string
  oldDate?: string
  participants: number
  costOMR: string
  paid: boolean
  refund?: 'none' | 'refunded' | 'processing'
  actor?: 'user' | 'admin'
}

export default function BookingEventInternalEmail(
  props: BookingEventInternalProps,
) {
  const title =
    props.event === 'cancelled' ? 'Booking cancelled' : 'Booking rescheduled'
  return (
    <EmailShell preview={`${title}: ${props.productTitle}`}>
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        {title}
        {props.actor === 'admin' ? ' (by admin)' : ''}
      </Text>
      <Text>
        <b>Product:</b> {props.productTitle}
        <br />
        <b>Customer:</b> {props.customerName} ({props.customerEmail})
        <br />
        {props.event === 'rescheduled' && props.oldDate ? (
          <>
            <b>Old date:</b> {props.oldDate}
            <br />
            <b>New date:</b> {props.chosenDate}
            <br />
          </>
        ) : (
          <>
            <b>Date:</b> {props.chosenDate}
            <br />
          </>
        )}
        <b>Participants:</b> {props.participants}
        <br />
        <b>Total:</b> {props.costOMR}
        <br />
        <b>Payment:</b> {props.paid ? 'Card (Thawani)' : 'Cash'}
        {props.event === 'cancelled' && props.refund ? (
          <>
            <br />
            <b>Refund:</b> {props.refund}
          </>
        ) : null}
        <br />
        <b>Reference:</b> {props.purchaseId}
      </Text>
    </EmailShell>
  )
}
