import styles from './contact.module.scss'

const Contact = () => {
  return (
    <div className={styles.contact}>
      <div className={styles.sectionheader}>
        {' '}
        <h1>CONTACT</h1>
      </div>
      <article>
        <p>
          You can reach us by pressing the big blue button, or use your
          favourite social media app from the icons below. Either way an
          adventure awaits!
        </p>

        <label for="checkcontact" className={styles.contactbutton}>
          <div className={styles.mail}></div>
        </label>
        <input
          id="checkcontact"
          className={styles.checkcontact}
          type="checkbox"
        />

        <form action="" method="post" className={styles.contactform}>
          <p className={styles.inputWrapper}>
            <input type="text" name="contact_nom" value="" id="contact_nom" />
            <label for="contact_nom">NAME</label>
          </p>
          <p className={styles.inputWrapper}>
            <input
              type="text"
              name="contact_email"
              value=""
              id="contact_email"
            />
            <label for="contact_email">EMAIL</label>
          </p>
          <p className={styles.inputWrapper}>
            <input
              type="text"
              name="contact_sujet"
              value=""
              id="contact_sujet"
            />
            <label for="contact_sujet">SUBJECT</label>
          </p>
          <p className={styles.textareaWrapper}>
            <textarea name="contact_message" id="contact_message"></textarea>
          </p>
          <p className={styles.submitWrapper}>
            <input type="submit" value="SEND" />
          </p>
        </form>
      </article>
    </div>
  )
}

export default Contact
