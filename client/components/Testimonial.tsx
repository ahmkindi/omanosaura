import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import styles from '../styles/Testimonial.module.scss'
import Switch from 'react-switch'

const Testimonial = () => {
  const { t, lang } = useTranslation()
  const [translate, setTranslate] = useState(false)

  return (
    <>
      <div className={styles.toggle}>
        <Switch
          checked={translate}
          onChange={(checked) => setTranslate(checked)}
          dir="rtl"
          onColor="#f58a07"
          onHandleColor="#043c6c"
          offHandleColor="#04d0e8"
          handleDiameter={20}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={30}
          width={115}
          id="material-switch"
          uncheckedIcon={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                fontSize: 16,
                fontWeight: 'bold',
                color: '043c6c',
                paddingRight: 60,
              }}
            >
              {t('translate')}
            </div>
          }
        />
      </div>
      <div
        className={`${styles.blockquote} ${
          lang === 'ar' ? (translate ? styles.blockAR : styles.blockAR) : null
        }`}
      >
        <h1>
          {translate ? (
            t('reviewDesc')
          ) : (
            <div dir="ltr">
              Conocimos Omanosaura por casualidad y al final, su calidad humana
              y buen servicio marcó la diferencia. Si buscas sentir la cultura
              omaní y vivir aventuras a un buen precio enhorabuena, estás en el
              lugar correcto
            </div>
          )}
        </h1>
        <h4>
          &mdash;{t('reviewName')}
          <br />
          <em>{t('reviewNameDesc')}</em>
        </h4>
      </div>
    </>
  )
}

export default Testimonial
