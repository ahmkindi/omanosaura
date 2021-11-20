import React, { Suspense, useState } from 'react'
import { Helmet } from 'react-helmet'
import 'bootstrap/dist/css/bootstrap.min.css'
import Loading from './components/Loading'
import Navigation from './components/Navigation'
import Trips from './components/Trips'
import Welcome from './components/Welcome'
import Adventures from './components/Adventures'
import About from './components/About'
import Contact from './components/Contact'
import Error404 from './components/errors/Error404'
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
        <div style={{ margin: 'auto', maxWidth: '1024px' }}>
          <Router>
            <Navigation />
            <Routes>
              <Route path="/trips" element={<Trips />} />
              <Route path="/adventures" element={<Adventures />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/" element={<Welcome />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </Router>
        </div>
      </Suspense>
    </LocaleContext.Provider>
  )
}

export default App
