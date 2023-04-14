import Map from '../components/svg/Map'
import Bus from '../components/svg/Bus'
import Adventurer from '../components/svg/Adventurer'
import { ProductKind } from './requests'
import { WhatWeOfferProps } from '../components/WhatWeOfferCard'
import Team from '../components/svg/Team'

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
