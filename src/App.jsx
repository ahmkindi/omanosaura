import React, { Suspense, useState } from 'react'
import { ThemeProvider } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import 'bootstrap/dist/css/bootstrap.min.css'
import Loading from './components/Loading'
import Navigation from './components/Navigation'
import Welcome from './components/Welcome'
import i18n from './i18n'
import LocaleContext from './LocaleContext'

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
          <style>{'body { background-color: #231f20; color: white;  }'}</style>
        </Helmet>
        <ThemeProvider dir={locale === 'en' ? 'ltr' : 'rtl'}>
          <Navigation />
          <Welcome />
        </ThemeProvider>
      </Suspense>
    </LocaleContext.Provider>
  )
}

export default App
