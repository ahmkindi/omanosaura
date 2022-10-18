import useTranslation from 'next-translate/useTranslation'
import Layout from '../components/Layout'
import Section from '../components/Section'
import {
  AiOutlineWhatsApp,
  AiOutlineInstagram,
  AiFillPhone,
} from 'react-icons/ai'
import { Alert, Spinner } from 'react-bootstrap'
import { useState } from 'react'
import axiosServer from '../utils/axiosServer'
import { EmptyEmailForm } from '../types/requests'
import styles from '../styles/contact.module.css'
import FlipCard from '../components/FlipCard'

const failedEmail = `oops! we couldn't send the email 😭| Try again, or contact us using one of the social icons above`
const successEmail = `Check your email to ensure we got your message 😇|`

const Contact = () => {
  const { t, lang } = useTranslation('contact')
  const [formOpen, setFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(EmptyEmailForm)
  const inputClass = `${styles.inputWrapper} ${
    lang === 'ar' ? styles.inputWrapperAR : null
  }`

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
      const response = await axiosServer.post('send', form)
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
    <Layout title={t('title')}>
      <Section title={t('pageTitle')}>
        <article style={{ maxWidth: '50%', margin: 'auto' }}>
          <p>{t('desc')}</p>
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

          <form
            onSubmit={(e) => handleSubmit(e)}
            className={styles.contactform}
          >
            <p className={inputClass}>
              <input
                type="text"
                name="contact_nom"
                id="contact_nom"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <label htmlFor="contact_nom">{t('name')}</label>
            </p>
            <p className={inputClass}>
              <input
                type="text"
                name="contact_email"
                id="contact_email"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <label htmlFor="contact_email">{t('email')}</label>
            </p>
            <p className={inputClass}>
              <input
                type="text"
                name="contact_sujet"
                id="contact_sujet"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, subject: e.target.value }))
                }
              />
              <label htmlFor="contact_sujet">{t('subject')}</label>
            </p>
            <p className={styles.textareaWrapper}>
              <textarea
                name="contact_message"
                id="contact_message"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
              ></textarea>
            </p>
            <p className={styles.submitWrapper}>
              <input type="submit" value={t('send')} />
            </p>
          </form>
        </article>
      </Section>
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
      <FlipCard back={'test'} front={'front'} />
    </Layout>
  )
}

export default Contact
