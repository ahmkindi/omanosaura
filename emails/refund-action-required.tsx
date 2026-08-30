import { Text } from '@react-email/components'
import { EmailShell } from './components'

export type RefundActionRequiredProps = {
  purchaseId: string
  productTitle: string
  customerName: string
  customerEmail: string
  customerPhone: string
  costOMR: string
  thawaniPaymentId: string | null
}

export default function RefundActionRequiredEmail(
  props: RefundActionRequiredProps,
) {
  return (
    <EmailShell preview={`Manual refund needed: ${props.purchaseId}`}>
      <Text style={{ color: '#b00020', fontSize: 20, fontWeight: 'bold' }}>
        Manual refund required
      </Text>
      <Text>
        The automatic Thawani refund for this cancelled booking failed (it may
        already be settled). Refund it manually in the Thawani merchant portal,
        then mark it refunded in the admin purchases table.
      </Text>
      <Text>
        <b>Purchase:</b> {props.purchaseId}
        <br />
        <b>Product:</b> {props.productTitle}
        <br />
        <b>Amount:</b> {props.costOMR}
        <br />
        <b>Thawani payment id:</b>{' '}
        {props.thawaniPaymentId ?? 'unresolved (find via client reference)'}
        <br />
        <b>Customer:</b> {props.customerName} ({props.customerEmail},{' '}
        {props.customerPhone})
      </Text>
    </EmailShell>
  )
}
