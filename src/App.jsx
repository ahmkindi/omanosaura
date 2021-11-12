import React, { Suspense, useState } from 'react'
import { Helmet } from 'react-helmet'
import 'bootstrap/dist/css/bootstrap.min.css'
import Loading from './components/Loading'
import Navigation from './components/Navigation'
import Trips from './components/Trips'
import Welcome from './components/Welcome'
import i18n from './i18n'
import LocaleContext from './LocaleContext'
import { ReactComponent as Lizard } from './assets/lizard.svg'
import styles from './app.module.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const [locale, setLocale] = useState(i18n.language)

  i18n.on('languageChanged', (lng) => setLocale(i18n.language))

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <Suspense fallback={<Loading />}>
        <Helmet
          htmlAttributes={{
            lang: locale,
          }}
        >
          <style>{'body { background-color: #229AA2; color: #043C6C  }'}</style>
        </Helmet>
        <Lizard className={styles.lizard} />
        <Router>
          <Navigation />
          <Routes>
            <Route path="/trips" element={<Trips />} />
            <Route path="/" element={<Welcome />} />
          </Routes>
        </Router>
      </Suspense>
    </LocaleContext.Provider>
  )
}

export default App
