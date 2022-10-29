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
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const PurchaseModal = ({
  product,
  setOpenModal,
}: {
  product: Product
  setOpenModal: React.Dispatch<React.SetStateAction<ModalTypes>>
}) => {
  const { t } = useTranslation()
  const { setAlert } = useGlobal()

  const PurchaseSchema = Yup.object().shape({
    quantity: Yup.number()
      .integer(t('common:onlyInt'))
      .min(1, t('common:tooLittle'))
      .max(500, t('common:tooMany'))
      .required(),
    chosenDate: Yup.date().min(getTomorrow(), t('common:tooShort')).required(),
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
          message: t('experiences:successfulPurchase'),
        })
      } else if (response.status === 200 && !values.cash) {
        router.push(response.data)
      } else {
        setAlert?.({
          type: 'warning',
          message: t('experiences:failedPurchase'),
        })
      }
    } catch (error) {
      setAlert?.({ type: 'warning', message: t('experiences:failedPurchase') })
    } finally {
      setOpenModal(ModalTypes.none)
    }
  }

  const highlightDates = [
    {
      'react-datepicker__day--highlighted-custom-1': product.plannedDates,
    },
  ]

  return (
    <Modal show onHide={() => setOpenModal(ModalTypes.none)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('experiences:purchase', { product: product.title })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={emptyPurchaseProduct}
          onSubmit={handleSubmit}
          validationSchema={PurchaseSchema}
        >
          {({ errors, handleChange, values, setValues, touched }) => (
            <FormikForm>
              <Form.Group className="mb-4">
                <Form.Label>{t('experiences:numOfParticipants')}</Form.Label>
                <Form.Control
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
                <Form.Label>{t('experiences:reviewDesc')}</Form.Label>
                <ReactDatePicker
                  selected={values.chosenDate}
                  onChange={(date) =>
                    setValues({ ...values, chosenDate: date ?? getTomorrow() })
                  }
                  minDate={getTomorrow()}
                  highlightDates={product.plannedDates.map((d) => new Date(d))}
                />
                <Form.Text className="invalid-feedback">
                  {getIn(errors, 'chosenDate')}
                </Form.Text>
                <Form.Text className="muted">
                  {t('experiences:explainGreen')}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>{t('experiences:payCash')}</Form.Label>
                <Form.Check
                  type="switch"
                  label={t('cash')}
                  name="cash"
                  onChange={handleChange}
                />
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setOpenModal(ModalTypes.none)}
                >
                  {t('close')}
                </Button>
                <Button variant="primary" type="submit">
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
