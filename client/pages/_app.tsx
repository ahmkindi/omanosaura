import { GetServerSidePropsContext } from 'next'
import { useState } from 'react'
import { AppProps } from 'next/app'
import { getCookie, setCookies } from 'cookies-next'
import Head from 'next/head'
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { rtlCache } from '../rtl-cache'
import useTranslation from 'next-translate/useTranslation'

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme)
  const { lang } = useTranslation()

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark')
    setColorScheme(nextColorScheme)
    setCookies('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  const rtl = lang === 'ar'

  return (
    <>
      <Head>
        <title>Mantine next example</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <div dir={rtl ? 'rtl' : 'ltr'}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            emotionCache={rtl ? rtlCache : undefined}
            theme={{
              colorScheme,
              defaultRadius: 'md',
              dir: rtl ? 'rtl' : 'ltr',
              fontFamily: 'Dinnext, Greta',
              dateFormat: 'DD/MM/YYYY',
              loader: 'bars',
              colors: {
                blue: [
                  '#E6F3FE',
                  '#BADEFC',
                  '#8EC9FB',
                  '#62B3F9',
                  '#359EF8',
                  '#0989F6',
                  '#076DC5',
                  '#055294',
                  '#043762',
                  '#021B31',
                ],
                orange: [
                  '#FEF3E6',
                  '#FDDFBA',
                  '#FCCA8D',
                  '#FAB560',
                  '#F9A034',
                  '#F88C07',
                  '#C67006',
                  '#955404',
                  '#633803',
                  '#321C01',
                ],
                cyan: [
                  '#E6FCFF',
                  '#B9F7FE',
                  '#8CF1FD',
                  '#5FECFC',
                  '#31E6FB',
                  '#04E1FB',
                  '#03B4C9',
                  '#038796',
                  '#025A64',
                  '#012D32',
                ],
                teal: [
                  '#EFF5F5',
                  '#D2E3E4',
                  '#B6D1D3',
                  '#99BEC2',
                  '#7CACB1',
                  '#609A9F',
                  '#4C7B80',
                  '#395C60',
                  '#263E40',
                  '#131F20',
                ],
              },
            }}
          >
            <NotificationsProvider>
              <Component {...pageProps} />
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </div>
    </>
  )
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
})
