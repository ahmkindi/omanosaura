import { Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'

export type PurchaseEmailProps = {
  purchaseId: string
  name: string
  email: string
  productTitle: string
  paid: boolean
  chosenDate: string
  costOMR: number
  participants: number
}

export default function PurchaseConfirmationEmail(props: PurchaseEmailProps) {
  return (
    <EmailShell preview={`Your booking for ${props.productTitle}`}>
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        Thank you for your purchase, {props.name}!
      </Text>
      <Text>
        Your booking for <b>{props.productTitle}</b> is confirmed.
      </Text>
      <Text>
        <b>Date:</b> {props.chosenDate}
        <br />
        <b>Participants:</b> {props.participants}
        <br />
        <b>Total:</b> {props.costOMR.toFixed(3)} OMR
        <br />
        <b>Payment:</b> {props.paid ? 'Paid online' : 'Cash on arrival'}
        <br />
        <b>Reference:</b> {props.purchaseId}
      </Text>
      <Text>
        If you have any questions, contact us at admin@omanosaura.com. See you
        on the trail!
      </Text>
      <Text>Omanosaura Team</Text>
    </EmailShell>
  )
}
