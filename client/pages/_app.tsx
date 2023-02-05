import '../styles/tailwind.css'
import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { GlobalProvider } from '../context/global'
import NextNProgress from 'nextjs-progressbar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider>
      <NextNProgress color={'var(--primary)'} showOnShallow={false} />
      <Component {...pageProps} />
    </GlobalProvider>
  )
}

export default MyApp
