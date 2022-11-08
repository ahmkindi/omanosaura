import { Formik, Form as FormikForm, getIn } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { ModalTypes } from '../pages/experiences/[id]'
import {
  emptyPurchaseProduct,
  Product,
  PurchaseProduct,
} from '../types/requests'
import * as Yup from 'yup'
import { getTomorrow } from '../utils/dates'
import axiosServer from '../utils/axiosServer'
import { useGlobal } from '../context/global'
import { useRouter } from 'next/router'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import ar from 'date-fns/locale/ar'
import 'react-datepicker/dist/react-datepicker.css'
import { getTotalPrice } from '../utils/price'
import Link from 'next/link'

const PurchaseModal = ({
  product,
  setOpenModal,
}: {
  product: Product
  setOpenModal: React.Dispatch<React.SetStateAction<ModalTypes>>
}) => {
  const { t, lang } = useTranslation('experiences')
  const { setAlert } = useGlobal()
  const isAr = lang === 'ar'
  registerLocale('ar', ar)

  const PurchaseSchema = Yup.object().shape({
    quantity: Yup.number()
      .integer(t('common:onlyInt'))
      .min(1, t('common:tooLittle'))
      .max(500, t('common:tooMany'))
      .required(),
    chosenDate: Yup.date().min(getTomorrow(), t('common:tooEarly')).required(),
    terms: Yup.boolean().isTrue(t('common:acceptTerms')),
  })
  const router = useRouter()

  const handleSubmit = async (values: PurchaseProduct) => {
    try {
      const response = await axiosServer.post('user/products/purchase', {
        ...values,
        productId: product.id,
      })
      console.log('response', response, response.request.responseURL)
      if (response.status === 200 && values.cash) {
        setAlert?.({
          type: 'success',
          message: t('successfulPurchase'),
        })
      } else if (response.status === 200 && !values.cash) {
        router.push(response.data)
      } else {
        setAlert?.({
          type: 'warning',
          message: t('failedPurchase'),
        })
      }
    } catch (error) {
      setAlert?.({ type: 'warning', message: t('failedPurchase') })
    } finally {
      setOpenModal(ModalTypes.none)
    }
  }

  return (
    <Modal
      show
      onHide={() => setOpenModal(ModalTypes.none)}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <Modal.Header>
        <Modal.Title>
          {t('purchaseTitle', {
            product: isAr ? product.titleAr : product.title,
          })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ ...emptyPurchaseProduct, terms: false }}
          onSubmit={handleSubmit}
          validationSchema={PurchaseSchema}
        >
          {({ errors, handleChange, values, setValues, touched }) => (
            <FormikForm>
              <Form.Group className="mb-4">
                <Form.Label>{t('numOfParticipants')}</Form.Label>
                <Form.Control
                  step={1}
                  name="quantity"
                  value={values.quantity}
                  type="number"
                  onChange={handleChange}
                  isInvalid={
                    errors.quantity !== undefined &&
                    errors.quantity.length > 0 &&
                    touched.quantity
                  }
                />
                <Form.Text className="invalid-feedback">
                  {errors.quantity}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>{t('chosenDate')}</Form.Label>
                <ReactDatePicker
                  selected={values.chosenDate}
                  onChange={(date) =>
                    setValues({ ...values, chosenDate: date ?? getTomorrow() })
                  }
                  minDate={getTomorrow()}
                  highlightDates={product.plannedDates.map((d) => new Date(d))}
                  locale={lang}
                />
                <Form.Text className="invalid-feedback">
                  {getIn(errors, 'chosenDate')}
                </Form.Text>
                <Form.Text className="muted">{t('explainGreen')}</Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>{t('payCash')}</Form.Label>
                <Form.Check
                  type="switch"
                  label={values.cash ? t('cash') : t('card')}
                  name="cash"
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, cash: !prev.cash }))
                  }
                  checked={values.cash}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>
                  <Link href="/terms.pdf">
                    <a target="_blank">{t('readTerms')}</a>
                  </Link>
                </Form.Label>
                <Form.Check
                  label={t('terms')}
                  name="terms"
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, terms: !prev.terms }))
                  }
                  checked={values.terms}
                  isInvalid={
                    errors.terms !== undefined &&
                    errors.terms.length > 0 &&
                    touched.terms
                  }
                />
                {errors.terms !== undefined &&
                  touched.terms && (
                    <Form.Text style={{ color: 'red' }}>
                      {errors.terms}
                    </Form.Text>
                  )}
              </Form.Group>
              <div className="mb-4" style={{ fontSize: '1.2rem' }}>
                {t('totalPrice')}
                <span style={{ fontWeight: 'bold' }}>
                  {getTotalPrice(
                    lang,
                    product,
                    values.quantity,
                    values.chosenDate
                  )}
                </span>
              </div>
              <Modal.Footer>
                <Button
                  variant="outline-secondary"
                  onClick={() => setOpenModal(ModalTypes.none)}
                >
                  {t('close')}
                </Button>
                <Button variant="outline-primary" type="submit">
                  {t('submit')}
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default PurchaseModal
