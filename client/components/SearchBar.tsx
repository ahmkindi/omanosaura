import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { TbLetterA, TbLetterT } from 'react-icons/tb'
import {
  InputGroup,
  Button,
  OverlayTrigger,
  Popover,
  Dropdown,
} from 'react-bootstrap'
import { FiList, FiMap } from 'react-icons/fi'
import { FaQuestion } from 'react-icons/fa'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MdAddCircleOutline } from 'react-icons/md'
import { useGlobal } from '../context/global'
import { UserRole, ProductKindLabel } from '../types/requests'

const SearchBar = ({ kinds }: { kinds: ProductKindLabel[] }): JSX.Element => {
  const { user } = useGlobal()
  const { t, lang } = useTranslation('experiences')
  const router = useRouter()
  const { kind, view } = router.query
  const isAr = lang === 'ar'

  return (
    <div className="flex gap-2 justify-center mb-3 mt-1">
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">{t('kind')}</Dropdown.Toggle>
        <Dropdown.Menu>
          {kinds.map((k) => (
            <Dropdown.Item
              onClick={() => {
                if (kind === k.id) {
                  delete router.query.kind
                } else {
                  router.query.kind = k.id
                }
                router.push(router)
              }}
              key={k.id}
              active={kind === k.id}
            >
              {lang === 'ar' ? k.labelAr : k.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {view === 'map' ? (
        <Button
          variant="secondary"
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={() => {
            router.query.view = 'list'
            router.push(router)
          }}
        >
          <div className="px-2">{t('listView')}</div> <FiList />
        </Button>
      ) : (
        <Button
          variant="secondary"
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={() => {
            router.query.view = 'map'
            router.push(router)
          }}
        >
          <div className="px-2">{t('mapView')}</div> <FiMap />
        </Button>
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
            <Popover.Body className="flex flex-col w-full">
              <div className="flex gap-2">
                <TbLetterT
                  className="border-2 border-primary mb-0 box-border w-1/6"
                  size={40}
                />
                <p className="grow-0 w-5/6">
                  <strong>{t('trip')}</strong>: {t('tripExplanation')}
                </p>
              </div>
              <div className="flex gap-2">
                <TbLetterA
                  className="border-2 border-primary mb-0 box-border w-1/6"
                  size={40}
                />
                <p className="grow-0 w-5/6">
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
    </div>
  )
}

export default SearchBar
