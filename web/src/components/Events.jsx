import { useTranslation } from 'react-i18next'
import styles from './welcome.module.scss'
import { Button, Modal } from 'react-bootstrap'
import axios from 'axios'
import useSWR from 'swr'
import { useState } from 'react'

const Events = () => {
  const { t } = useTranslation()
  const { data: events } = useSWR('/current/events', async (url) => {
    const { data } = await axios.get(url)
    return data
  })
  const [show, setShow] = useState('')

  const handleSubmit = () => {
    setShow('')
  }

  if (!events) return null

  return (
    <div className={`${styles.section} ${styles.events}`}>
      <h3>{t('currentEvents')}</h3>
      <div>
        {events.map((event) => (
          <div className={styles.event} key={event.id}>
            <img alt="event" src={`data:image/jpeg;base64,${event.photo}`} />
            <Button
              className={styles.myButton}
              onClick={() => setShow(event.id)}
            >
              {t(`register`)}
            </Button>
          </div>
        ))}
        <Modal show={show !== ''} onHide={() => setShow('')}>
          <Modal.Header closeButton>
            <Modal.Title>Register Interest</Modal.Title>
          </Modal.Header>
          <Modal.Body></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow('')}>
              Back
            </Button>
            <Button variant="primary" onClick={() => handleSubmit()}>
              Done!
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default Events
