import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { ModalTypes } from '../pages/experiences/[id]'
import { Product } from '../types/requests'

const PurchaseModal = ({
  product,
  setOpenModal,
}: {
  product: Product
  setOpenModal: React.Dispatch<React.SetStateAction<ModalTypes>>
}) => {
  const { t } = useTranslation()

  return (
    <Modal show onHide={() => setOpenModal(ModalTypes.none)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('experiences:purchase', { product: product.title })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
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
    </Modal>
  )
}

export default PurchaseModal
