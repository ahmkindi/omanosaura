import { useTranslation } from 'react-i18next'
import styles from './welcome.module.scss'
import { Button, Form, Modal, Toast } from 'react-bootstrap'
import axios from 'axios'
import useSWR from 'swr'
import { useRef, useState } from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import coloredSmallLogo from '../assets/colored_small.png'
import { useContext } from 'react'
import LocaleContext from '../LocaleContext'
import Terms from '../assets/terms.pdf'

const Events = () => {
  const { locale } = useContext(LocaleContext)
  const { t } = useTranslation()
  const { data: events } = useSWR('/api/current/events', async (url) => {
    const { data } = await axios.get(url)
    return data
  })
  const [show, setShow] = useState('')
  const [phone, setPhone] = useState()
  const name = useRef()
  const email = useRef()
  const agree = useRef()
  const [success, setSuccess] = useState()

  const isAr = locale === 'ar'

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/users/interested/${show}`, {
        name: name.current.value,
        email: email.current.value,
        phone: phone,
      })
      if (response.status === 200) {
        setSuccess(true)
      } else {
        setSuccess(false)
      }
    } catch (error) {
      setSuccess(false)
    } finally {
      setShow('')
    }
  }

  if (!events) return null

  return (
    <div className={`${styles.section} ${styles.events}`}>
      <h3>{t('currentEvents')}</h3>
      <div>
        {events?.map((event) => (
          <div className={styles.event} key={event.id}>
            <img alt="event" src={`data:image/jpeg;base64,${event.photo}`} />
            <Button
              className={styles.myButton}
              onClick={() => setShow(event.id)}
            >
              {t('register')}
            </Button>
          </div>
        ))}
        <Modal
          show={show !== ''}
          onHide={() => setShow('')}
          style={{ direction: isAr ? 'rtl' : 'ltr' }}
        >
          <Modal.Header>
            <Modal.Title>{t('interested')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>{t('name')}</Form.Label>
                <Form.Control
                  className={styles.myInput}
                  type="text"
                  ref={name}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPhone">
                <PhoneInput
                  placeholder={t('phone')}
                  value={phone}
                  onChange={setPhone}
                  className={styles.myInput}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>{t('email')}</Form.Label>
                <Form.Control
                  type="email"
                  ref={email}
                  className={styles.myInput}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Form.Check type="checkbox" ref={agree} />
                  <a href={Terms} target="_blank" rel="noreferrer">
                    {t('agree')}
                  </a>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow('')}>
              {t('back')}
            </Button>
            <Button
              variant="primary"
              disabled={!agree.current?.checked || phone === undefined}
              onClick={() => handleSubmit()}
              className={styles.myButton}
            >
              {t('done')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Toast
        className={styles.toast}
        onClose={() => setSuccess(undefined)}
        show={success !== undefined}
        delay={5500}
        autohide
      >
        <Toast.Header>
          <img
            src={coloredSmallLogo}
            width={30}
            className="rounded me-auto"
            alt=""
          />
          <strong className="me-auto"></strong>
          <small className="px-2">{success ? t('success') : t('error')}</small>
        </Toast.Header>
        <Toast.Body style={{ fontSize: '1.1rem' }}>
          {success ? t('registered') : t('failedRegister')}
        </Toast.Body>
      </Toast>
    </div>
  )
}

export default Events
