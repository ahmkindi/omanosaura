import { useContext, useRef, useState } from 'react'
import LocaleContext from '../LocaleContext'
import styles from './contact.module.scss'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import {
  AiOutlineWhatsApp,
  AiOutlineInstagram,
  AiFillPhone,
} from 'react-icons/ai'
import { Alert, Spinner } from 'react-bootstrap'

const failedEmail = `oops! we couldn't send the email 😭| Try again, or contact us using one of the social icons above`
const successEmail = `Check your email to ensure we got your message 😇|`

const Contact = () => {
  const { t } = useTranslation()
  const { locale } = useContext(LocaleContext)
  const [formOpen, setFormOpen] = useState(false)
  const name = useRef(null)
  const email = useRef(null)
  const subject = useRef(null)
  const message = useRef(null)
  const inputClass = `${styles.inputWrapper} ${
    locale === 'ar' ? styles.inputWrapperAR : null
  }`
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
      const response = await axios.post('/api/send', {
        name: name.current.value,
        email: email.current.value,
        subject: subject.current.value,
        message: message.current.value,
      })
      if (response.status === 200) {
        setAlertText(successEmail)
      } else {
        setAlertText(failedEmail)
      }
    } catch (error) {
      setAlertText(failedEmail)
    } finally {
      setLoading(false)
      setFormOpen(false)
    }
  }

  const [alertText, setAlertText] = useState('')

  return (
    <div className={styles.contact}>
      <div className={styles.sectionheader}>
        {' '}
        <h1>{t('contactShort')}</h1>
      </div>
      <article>
        <p>{t('contactDesc')}</p>
        <div className={styles.socials}>
          <a
            href="https://www.instagram.com/omanosaura/"
            target="_blank"
            rel="noreferrer"
          >
            <AiOutlineInstagram />
          </a>
          <a
            href="https://wa.me/0096895598840"
            target="_blank"
            rel="noreferrer"
          >
            <AiOutlineWhatsApp />
          </a>
          <a
            href="tel:+96892767527"
            onClick={() => {
              navigator.clipboard.writeText('0096892767527')
              setAlertText('Phone Number Copied 😎|')
            }}
          >
            <AiFillPhone />
          </a>
        </div>

        <label htmlFor="checkcontact" className={styles.contactbutton}>
          {!loading && <div className={styles.mail}></div>}
          {loading && <Spinner animation="border" variant="light" />}
        </label>
        <input
          id="checkcontact"
          className={styles.checkcontact}
          type="checkbox"
          checked={formOpen}
          onChange={() => setFormOpen((prevValue) => !prevValue)}
        />

        <form onSubmit={(e) => handleSubmit(e)} className={styles.contactform}>
          <p className={inputClass}>
            <input type="text" name="contact_nom" id="contact_nom" ref={name} />
            <label htmlFor="contact_nom">{t('name')}</label>
          </p>
          <p className={inputClass}>
            <input
              type="text"
              name="contact_email"
              id="contact_email"
              ref={email}
            />
            <label htmlFor="contact_email">{t('email')}</label>
          </p>
          <p className={inputClass}>
            <input
              type="text"
              name="contact_sujet"
              id="contact_sujet"
              ref={subject}
            />
            <label htmlFor="contact_sujet">{t('subject')}</label>
          </p>
          <p className={styles.textareaWrapper}>
            <textarea
              name="contact_message"
              id="contact_message"
              ref={message}
            ></textarea>
          </p>
          <p className={styles.submitWrapper}>
            <input type="submit" value={t('send')} />
          </p>
        </form>
      </article>
      {alertText !== '' && (
        <Alert
          variant={alertText.includes('oops') ? 'danger' : 'success'}
          onClose={() => setAlertText('')}
          dismissible
        >
          <Alert.Heading>
            {alertText.substring(0, alertText.indexOf('|'))}
          </Alert.Heading>
          <p>{alertText.substring(alertText.indexOf('|') + 1)}</p>
        </Alert>
      )}
    </div>
  )
}

export default Contact
