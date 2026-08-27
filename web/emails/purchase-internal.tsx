import { Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'
import type { PurchaseEmailProps } from './purchase-confirmation'

export default function PurchaseInternalEmail(props: PurchaseEmailProps) {
  return (
    <EmailShell preview={`New purchase: ${props.productTitle}`}>
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        New Purchase
      </Text>
      <Text>
        <b>Product:</b> {props.productTitle}
        <br />
        <b>Customer:</b> {props.name} ({props.email})
        <br />
        <b>Date:</b> {props.chosenDate}
        <br />
        <b>Participants:</b> {props.participants}
        <br />
        <b>Total:</b> {props.costOMR.toFixed(3)} OMR
        <br />
        <b>Payment:</b> {props.paid ? 'Paid online' : 'CASH — collect on site'}
        <br />
        <b>Reference:</b> {props.purchaseId}
      </Text>
    </EmailShell>
  )
}
