import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { BiTrip } from 'react-icons/bi'
import { GiMountainClimbing } from 'react-icons/gi'
import {
  InputGroup,
  Form,
  Button,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap'
import { FiList, FiMap } from 'react-icons/fi'
import { FaQuestion } from 'react-icons/fa'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MdAddCircleOutline } from 'react-icons/md'
import { useGlobal } from '../context/global'
import { UserRole } from '../types/requests'

const popoverStyle = { display: 'flex', gap: '1rem', marginBottom: '0.5rem' }

const SearchBar = (): JSX.Element => {
  const { user } = useGlobal()
  const { t, lang } = useTranslation('experiences')
  const router = useRouter()
  const { search, view } = router.query
  const isAr = lang === 'ar'

  return (
    <InputGroup className="mb-4 mt-4 p-2">
      <Form.Control
        placeholder={t('searchExp')}
        aria-label="Search Experiences"
        onChange={(e) => {
          router.query.search = e.target.value
          router.push(router)
        }}
        value={search}
      />
      {view === 'list' ? (
        <button
          className="bg-secondary hover:border-2 hover:border-primary box-border py-2 px-4 rounded inline-flex items-center"
          onClick={() => {
            router.query.view = 'map'
            router.push(router)
          }}
        >
          <div className="px-2">{t('mapView')}</div> <FiMap />
        </button>
      ) : (
        <button
          className="bg-secondary hover:border-2 hover:border-primary box-border py-2 px-4 rounded inline-flex items-center"
          onClick={() => {
            router.query.view = 'list'
            router.push(router)
          }}
        >
          <div className="px-2">{t('listView')}</div> <FiList />
        </button>
      )}
      {user?.role === UserRole.admin && (
        <Link href="/experiences/create" passHref>
          <Button variant="outline-secondary">
            <MdAddCircleOutline />
          </Button>
        </Link>
      )}
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
          <Popover dir={isAr ? 'rtl' : 'ltr'}>
            <Popover.Header as="h3">{t('twoProducts')}</Popover.Header>
            <Popover.Body>
              <div style={popoverStyle}>
                <BiTrip size={50} />
                <p>
                  <strong>{t('trip')}</strong>: {t('tripExplanation')}
                </p>
              </div>
              <div style={popoverStyle}>
                <GiMountainClimbing size={50} />
                <p>
                  <strong>{t('adventure')}</strong>: {t('adventureExplanation')}
                </p>
              </div>
            </Popover.Body>
          </Popover>
        }
      >
        <Button variant="outline-secondary">
          <FaQuestion />
        </Button>
      </OverlayTrigger>
    </InputGroup>
  )
}

export default SearchBar
