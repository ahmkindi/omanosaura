import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import styles from '../styles/about.module.scss'
import Layout from '../components/Layout'
import Box from '../components/Box'
import Section from '../components/Section'
import WhyUsCard from '../components/WhyUsCard'
import { BsBinocularsFill } from 'react-icons/bs'
import { TbTargetArrow } from 'react-icons/tb'

const team = 5

const About = () => {
  const { t } = useTranslation('about')

  return (
    <Layout title={t('title')}>
      <Section title={t('pageTitle')}>
        <h5 style={{ margin: '0 0.5rem', textAlign: 'center' }}>{t('desc')}</h5>
        <Box>
          <WhyUsCard
            header={t('mission.title')}
            desc={t('mission.desc')}
            icon={<BsBinocularsFill />}
          />
          <WhyUsCard
            header={t('vision.title')}
            desc={t('vision.desc')}
            icon={<TbTargetArrow />}
          />
        </Box>
      </Section>
      <Section title={t('champ')}>
        {Array.from(Array(team).keys()).map((i) => (
          <div key={`champ-${i}`}>
            <Image
              src={`/champs/${i + 1}.jpeg`}
              alt={t(`champs.${i + 1}.title`)}
            />
          </div>
        ))}
      </Section>
    </Layout>
  )
}

export default About
