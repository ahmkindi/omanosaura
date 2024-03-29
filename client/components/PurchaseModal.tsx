import { Formik, Form as FormikForm } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import {
  emptyPurchaseProduct,
  Product,
  PurchaseProduct,
} from '../types/requests'
import * as Yup from 'yup'
import { getAfterTomorrow, getTomorrow } from '../utils/dates'
import axiosServer from '../utils/axiosServer'
import { useGlobal } from '../context/global'
import { useRouter } from 'next/router'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import ar from 'date-fns/locale/ar'
import 'react-datepicker/dist/react-datepicker.css'
import { getBasePrice, getTotalPrice } from '../utils/price'
import Link from 'next/link'
import IncrementDecrement from './IncrementDecrement'

const PurchaseModal = ({
  product,
  closeModal,
}: {
  product: Product
  closeModal: () => void
}) => {
  const { user, setPurchase, purchase } = useGlobal()
  const { t, lang } = useTranslation('experiences')
  const { setAlert } = useGlobal()
  const isAr = lang === 'ar'
  const router = useRouter()
  registerLocale('ar', ar)

  const price = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: 'OMR',
    maximumFractionDigits: 1,
  }).format(product.basePriceBaisa / 1000 ?? 0)

  const PurchaseSchema = Yup.object().shape({
    quantity: Yup.number()
      .integer(t('common:onlyInt'))
      .min(1, t('common:tooLittle'))
      .max(500, t('common:tooMany'))
      .required(),
    chosenDate: Yup.date().min(getTomorrow(), t('common:tooEarly')).required(),
  })

  const handleSubmit = async (values: PurchaseProduct) => {
    try {
      if (!user) {
        setPurchase?.(values)
        delete router.query.experienceModal
        router.query.modal = 'login'
        router.push(router)
        return
      }
      const response = await axiosServer.post('user/products/purchase', {
        ...values,
        productId: product.id,
      })
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
      closeModal()
    }
  }

  return (
    <Modal show onHide={() => closeModal()} dir={isAr ? 'rtl' : 'ltr'}>
      <Modal.Header>
        <Modal.Title>
          {t('purchaseTitle', {
            product: isAr ? product.titleAr : product.title,
          })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={purchase ? purchase : { ...emptyPurchaseProduct }}
          onSubmit={handleSubmit}
          validationSchema={PurchaseSchema}
        >
          {({ errors, values, setValues }) => (
            <FormikForm>
              <Form.Group className="mb-4">
                <Form.Label>{t('numOfParticipants')}</Form.Label>
                <IncrementDecrement count={values.quantity} setCount={setValues} />
                <Form.Text className="invalid-feedback">
                  {errors.quantity}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>{t('chosenDate')}</Form.Label>
                <ReactDatePicker
                  selected={values.chosenDate}
                  onChange={(date) =>
                    setValues({
                      ...values,
                      chosenDate: date ?? getAfterTomorrow(),
                    })
                  }
                  minDate={getAfterTomorrow()}
                  highlightDates={product.plannedDates.map((d) => new Date(d))}
                  locale={lang}
                />
                <Form.Text className="muted">{t('explainGreen')}</Form.Text>
              </Form.Group>
              <Form.Group className="mb-4 flex gap-3 items-center">
                <Form.Label>{t('payCash')}</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    label={t('cash')}
                    name="cash"
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, cash: true }))
                    }
                    checked={values.cash}
                  />
                  <Form.Check
                    type="radio"
                    label={t('card')}
                    name="cash"
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, cash: false }))
                    }
                    checked={!values.cash}
                  />
                </div>
              </Form.Group>
              <Form.Group
                className="mb-4 flex gap-2"
                onClick={() =>
                  setValues((prev) => ({ ...prev, payExtra: !prev.payExtra }))
                }
              >
                <Form.Check checked={values.payExtra} />
                <Form.Label>
                  {t('payExtra', {
                    price: new Intl.NumberFormat(lang, {
                      style: 'currency',
                      currency: 'OMR',
                      maximumFractionDigits: 2,
                    }).format(product.extraPriceBaisa / 1000),
                  })}
                </Form.Label>
              </Form.Group>
              <div className="mb-4">
                {product.pricePer !== 1 && <p className="text-xs font-light mb-0">
                  {t(
                    `common:pricePer.${product.pricePer === 1
                      ? 'single'
                      : product.pricePer === 2
                        ? 'duo'
                        : 'multi'
                    }`,
                    {
                      price: getBasePrice(lang, product, values.quantity),
                      people: Math.ceil(values.quantity / product.pricePer) * product.pricePer,
                    }
                  )}
                </p>
                }
                <div className='text-lg'>
                  {t('totalPrice')}
                  <span style={{ fontWeight: 'bold' }}>
                    {getTotalPrice(
                      lang,
                      product,
                      values.quantity,
                      values.payExtra,
                      values.chosenDate
                    )}
                  </span>
                </div>
              </div>
              <Modal.Footer className="flex flex-col items-end gap-2">
                <div className="flex gap-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => closeModal()}
                  >
                    {t('close')}
                  </Button>
                  <Button variant="outline-primary" type="submit">
                    {t('submit')}
                  </Button>
                </div>
                <div className="flex text-xs text-blue-600/50 gap-1 w-full">
                  <p className="font-thin">{t('byPurchasing')}</p>
                  <Link href="/terms.pdf" target="_blank">
                    {t('readTerms')}
                  </Link>
                </div>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default PurchaseModal
