import { useTranslation } from 'react-i18next'

const About = () => {
  const { t } = useTranslation()
  return (
    <div>
      {t('jaifar')} {t('jaifarDesc')} {t('companyDesc')}
    </div>
  )
}

export default About
