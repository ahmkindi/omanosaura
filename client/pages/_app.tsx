import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'

function MyApp({ Component, pageProps }: AppProps) {
  const { lang } = useTranslation()
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          defaultRadius: 'md',
          dir: lang === 'ar' ? 'rtl' : 'ltr',
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
        <Component {...pageProps} />
      </MantineProvider>
    </>
  )
}

export default MyApp
