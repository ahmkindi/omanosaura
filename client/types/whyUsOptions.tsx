import { MdGroups as WhyUsIcon1 } from 'react-icons/md'
import { HiSparkles as WhyUsIcon2 } from 'react-icons/hi'
import { AiOutlineSafetyCertificate as WhyUsIcon3 } from 'react-icons/ai'
import Map from '../components/svg/Map'
import Bus from '../components/svg/Bus'
import Adventurer from '../components/svg/Adventurer'
import { ProductKind } from './requests'
import { WhatWeOfferProps } from '../components/WhatWeOfferCard'
import Team from '../components/svg/Team'

export const whyUsOptions = [
  {
    icon: <WhyUsIcon1 size={75} />,
    header: `whyUsTitle1`,
    desc: `whyUsDesc1`,
  },
  {
    icon: <WhyUsIcon2 size={75} />,
    header: `whyUsTitle2`,
    desc: `whyUsDesc2`,
  },
  {
    icon: <WhyUsIcon3 size={75} />,
    header: `whyUsTitle3`,
    desc: `whyUsDesc3`,
  },
]

export const whatWeOffer: WhatWeOfferProps[] = [
  ...Object.values(ProductKind).map((k) => ({
    icon:
      k === ProductKind.school ? (
        <Bus />
      ) : k === ProductKind.exp ? (
        <Map />
      ) : (
        <Team />
      ),
    title: `common:productkind.${k}.title`,
    desc: `common:productkind.${k}.desc`,
    href: `/experiences?kind=${k}`,
  })),
  {
    icon: <Adventurer />,
    title: 'service.title',
    desc: 'service.desc',
    href: '/contact',
  },
]
