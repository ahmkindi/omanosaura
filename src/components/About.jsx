import { useTranslation } from 'react-i18next'
import Jaifar from '../assets/jaifar.png'

const About = () => {
  const { t } = useTranslation()
  return (
    <div>
      <img src={Jaifar} alt="omanosaura founder Jaifar Al Kindi" width={400} />
      {t('jaifar')} {t('jaifarDesc')} {t('companyDesc')}
    </div>
  )
}

export default About
