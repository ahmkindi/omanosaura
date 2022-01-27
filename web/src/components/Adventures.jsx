import styles from './adventures.module.scss'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import axios from 'axios'
import { useContext } from 'react'
import LocaleContext from '../LocaleContext'

const Adventures = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { locale } = useContext(LocaleContext)

  const { data: adventures } = useSWR('/adventures', async (url) => {
    const { data } = await axios.get(url)
    return data
  })

  const isAr = locale === 'ar'

  return (
    <div className={styles.advContainer}>
      {adventures?.map((adv) => (
        <div
          className={styles.card}
          style={{
            backgroundImage: `url(data:image/jpeg;base64,${adv.photo})`,
          }}
        >
          <div className={styles.content}>
            <h2 className={styles.title}>{isAr ? adv.title_ar : adv.title}</h2>
            <p className={styles.copy}>
              {isAr ? adv.description_ar : adv.description}
            </p>
            <button className={styles.btn} onClick={() => navigate('/contact')}>
              {t('contact')}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Adventures
