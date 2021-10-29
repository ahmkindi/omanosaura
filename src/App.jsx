import React, { Suspense, useState } from 'react'
import { ThemeProvider } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import 'bootstrap/dist/css/bootstrap.min.css'
import Loading from './components/Loading'
import Navigation from './components/Navigation'
import Welcome from './components/Welcome'
import i18n from './i18n'
import LocaleContext from './LocaleContext'
import { ReactComponent as Lizard } from './assets/lizard.svg'
import styles from './app.module.scss'

function App() {
  const [locale, setLocale] = useState(i18n.language)

  i18n.on('languageChanged', (lng) => setLocale(i18n.language))

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <Suspense fallback={<Loading />}>
        <Helmet
          htmlAttributes={{
            lang: locale,
            dir: locale === 'en' ? 'ltr' : 'rtl',
          }}
        >
          <style>{'body { background-color: #229AA2; color: #043C6C  }'}</style>
        </Helmet>
        <ThemeProvider dir={locale === 'en' ? 'ltr' : 'rtl'}>
          <Lizard className={styles.lizard} />
          <Navigation />
          <Welcome />
        </ThemeProvider>
      </Suspense>
    </LocaleContext.Provider>
  )
}

export default App
