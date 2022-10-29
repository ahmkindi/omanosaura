import { MdGroups as WhyUsIcon1 } from 'react-icons/md'
import { HiSparkles as WhyUsIcon2 } from 'react-icons/hi'
import { AiOutlineSafetyCertificate as WhyUsIcon3 } from 'react-icons/ai'
import Map from '../components/svg/Map'
import Adventurer from '../components/svg/Adventurer'

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

export const whatWeOffer = [
  {
    icon: <Map />,
    text: 'premade',
  },
  {
    icon: <Adventurer />,
    text: 'custom',
  },
]
