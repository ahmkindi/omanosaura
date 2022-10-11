import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import useUser from '../hooks/useUser'
import { navOptions } from '../types/values'
import styles from '../styles/NavBar.module.css'
import { ActionIcon, Avatar, Button, Group, Stack } from '@mantine/core'
import Image from 'next/image'
import { NextLink } from '@mantine/next'
import { IconUserCircle } from '@tabler/icons'

const NavBar = () => {
  const { user, isLoading, login, logout } = useUser()
  const { t, lang } = useTranslation('common')
  const { pathname } = useRouter()

  const isAr = lang === 'ar'

  return (
    <Group
      position="apart"
      sx={{
        paddingTop: '1rem',
      }}
    >
      <Image
        src={isAr ? '/logo_ar.png' : '/main_logo.png'}
        alt="Omanosaura Logo"
        width={414.54}
        height={111.36}
      />
      <Stack>
        <Group position="right">
          <ActionIcon variant="transparent" size="lg" color={'orange'}>
            <IconUserCircle size={'lg'} />
          </ActionIcon>
          <Link href="" locale={lang === 'ar' ? 'en' : 'ar'} passHref>
            <Button variant="subtle" color="orange" size="lg">
              {t('language')}
            </Button>
          </Link>
        </Group>
        <div>
          {navOptions.map((o) => (
            <Link key={o} href={`/${o}`} passHref>
              <Button
                size="lg"
                variant={pathname === `/${o}` ? 'filled' : 'subtle'}
              >
                {t('trips')}
              </Button>
            </Link>
          ))}
        </div>
      </Stack>
    </Group>
  )
}

export default NavBar
