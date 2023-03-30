import '../styles/tailwind.css'
import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { GlobalProvider } from '../context/global'
import NextNProgress from 'nextjs-progressbar'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'

const font = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500'],
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider>
      <NextNProgress color={'var(--primary)'} showOnShallow={false} />
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
    </GlobalProvider>
  )
}

export default MyApp
