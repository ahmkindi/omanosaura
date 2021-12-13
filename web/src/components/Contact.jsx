import { useRef, useState } from 'react'
import styles from './contact.module.scss'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const Contact = () => {
  const { t } = useTranslation()
  const [formOpen, setFormOpen] = useState(false)
  const name = useRef(null)
  const email = useRef(null)
  const subject = useRef(null)
  const message = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(name.current.value)
    console.log(message.current.value)

    setFormOpen(false)
    axios
      .post('api/send', {
        name: 'name',
        email: 'ahmkind19@gmail.com',
        subject: 'subject',
        message: 'message',
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error))
  }

  return (
    <div className={styles.contact}>
      <div className={styles.sectionheader}>
        {' '}
        <h1>{t('contactShort')}</h1>
      </div>
      <article>
        <p>{t('contactDesc')}</p>

        <label htmlFor="checkcontact" className={styles.contactbutton}>
          <div className={styles.mail}></div>
        </label>
        <input
          id="checkcontact"
          className={styles.checkcontact}
          type="checkbox"
          checked={formOpen}
          onChange={() => setFormOpen((prevValue) => !prevValue)}
        />

        <form onSubmit={(e) => handleSubmit(e)} className={styles.contactform}>
          <p className={styles.inputWrapper}>
            <input type="text" name="contact_nom" id="contact_nom" ref={name} />
            <label htmlFor="contact_nom">{t('name')}</label>
          </p>
          <p className={styles.inputWrapper}>
            <input
              type="text"
              name="contact_email"
              id="contact_email"
              ref={email}
            />
            <label htmlFor="contact_email">{t('email')}</label>
          </p>
          <p className={styles.inputWrapper}>
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
    </div>
  )
}

export default Contact
