import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { GlobalProvider } from '../context/global'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider>
      <Component {...pageProps} />
    </GlobalProvider>
  )
}

export default MyApp
