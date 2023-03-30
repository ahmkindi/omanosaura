import type { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { Button } from 'react-bootstrap'
import Box from '../components/Box'
import Layout from '../components/Layout'
import Section from '../components/Section'
import Smartphone from '../components/Smartphone'
import Testimonial from '../components/Testimonial'
import styles from '../styles/Home.module.scss'
import WhatWeOffer from '../components/WhatWeOfferCard'
import WhyUsCard from '../components/WhyUsCard'
import { whatWeOffer, whyUsOptions } from '../types/whyUsOptions'

const Home: NextPage = () => {
  const { t, lang } = useTranslation('home')

  return (
    <Layout>
      <Box className={styles.bgimage}>
        <img className={styles.full} src="/back-photo.jpg" />
        <div
          className={`${styles.overlay} ${
            lang === 'ar' ? styles.overlayAr : null
          }`}
        />
        <div>
          <div className={styles.omanSlogan}>{t('omanSlogan')}</div>
          <div className={styles.contact}>{t('introText')}</div>
          <Link href="/experiences" passHref>
            <Button className={styles.myButton}>{t('contactText')}</Button>
          </Link>
        </div>
        <Smartphone />
      </Box>
      <Section title={t('services')}>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {whatWeOffer.map((w) => (
            <WhatWeOffer key={w.href} {...w} />
          ))}
        </div>
      </Section>
      <Section title={t('whyUs')}>
        <div className={styles.whyUs}>
          {whyUsOptions.map((w) => (
            <WhyUsCard
              icon={w.icon}
              header={w.header}
              desc={w.desc}
              key={w.header}
            />
          ))}
        </div>
      </Section>
      <Section title={t('reviews')}>
        <Testimonial />
      </Section>
    </Layout>
  )
}

export default Home
