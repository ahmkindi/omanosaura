import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import styles from '../styles/about.module.css'
import Layout from '../components/Layout'
import Box from '../components/Box'
import Section from '../components/Section'

const About = () => {
  const { t } = useTranslation('about')

  return (
    <Layout title={t('title')}>
      <Section title={t('pageTitle')}>
        <h5 style={{ margin: '0 0.5rem', textAlign: 'center' }}>{t('desc')}</h5>
      </Section>
      <Section title={t('champ')}>
        <Box>
          <div className={styles.aboutImg}>
            <Image
              src="/jaifar.png"
              alt="omanosaura founder Jaifar Al Kindi"
              layout="responsive"
              width={350}
              height={350}
            />
          </div>
          <div>
            <h2>{t('jaifar')}</h2>
            <h4>{t('jaifarTitle')}</h4>
            <br />
            <h5>{t('jaifarDesc')}</h5>
          </div>
        </Box>
      </Section>
    </Layout>
  )
}

export default About
