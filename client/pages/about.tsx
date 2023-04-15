import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import styles from '../styles/about.module.scss'
import Layout from '../components/Layout'
import Box from '../components/Box'
import Section from '../components/Section'
import WhyUsCard from '../components/WhyUsCard'
import { BsBinocularsFill } from 'react-icons/bs'
import { TbTargetArrow } from 'react-icons/tb'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const team = 6

const About = () => {
  const { t, lang } = useTranslation('about')

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 620 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 620, min: 0 },
      items: 1,
    },
  }

  return (
    <Layout title={t('title')}>
      <Section title={t('pageTitle')}>
        <h5 style={{ margin: '0 0.5rem', textAlign: 'center' }}>{t('desc')}</h5>
        <Box>
          <WhyUsCard
            header={t('mission.title')}
            desc={t('mission.desc')}
            icon={<BsBinocularsFill size={75} />}
          />
          <WhyUsCard
            header={t('vision.title')}
            desc={t('vision.desc')}
            icon={<TbTargetArrow size={75} />}
          />
        </Box>
      </Section>
      <Section title={t('champs.title')}>
        <Carousel
          swipeable
          responsive={responsive}
          ssr
          rtl={lang === 'ar'}
          partialVisbile
          showDots
        >
          {Array.from(Array(team).keys()).map((i) => (
            <div
              key={`champ-${i}`}
              className="flex flex-col items-center mx-3 mb-1"
              style={{ maxWidth: '390px' }}
            >
              <h2>{t(`champs.${i + 1}.name`)}</h2>
              <h4 className="text-lg">{t(`champs.${i + 1}.title`)}</h4>
              <Image
                src={`/champs/${i + 1}.jpeg`}
                alt={t(`champs.${i + 1}.name`)}
                className="mb-2 rounded-lg shadow-md select-none justify-center"
                width={384}
                height={512}
              />
              <p className={lang === 'ar' ? 'text-md' : 'text-sm'}>
                {t(`champs.${i + 1}.desc`)}
              </p>
            </div>
          ))}
        </Carousel>
      </Section>
    </Layout>
  )
}

export default About
