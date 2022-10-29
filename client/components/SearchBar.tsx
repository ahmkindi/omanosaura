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

const popoverStyle = { display: 'flex', gap: '1rem', marginBottom: '0.5rem' }

const SearchBar = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { search, view } = router.query

  return (
    <InputGroup className="mb-4 mt-4 p-2">
      <Form.Control
        placeholder="Search Experiences"
        aria-label="Search Experiences"
        onChange={(e) => {
          router.query.search = e.target.value
          router.push(router)
        }}
        value={search}
      />
      {view === 'list' ? (
        <Button
          variant="secondary"
          onClick={() => {
            router.query.view = 'map'
            router.push(router)
          }}
        >
          Map View <FiMap />
        </Button>
      ) : (
        <Button
          variant="secondary"
          onClick={() => {
            router.query.view = 'list'
            router.push(router)
          }}
        >
          List View <FiList />
        </Button>
      )}
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
          <Popover>
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
