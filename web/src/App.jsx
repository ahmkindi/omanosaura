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
import Footer from './components/Footer'
import Error404 from './components/errors/Error404'
import { AdminHome, AdminTrips } from './components/admin'
import i18n from './i18n'
import LocaleContext from './LocaleContext'
import AuthContext from './AuthContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const [locale, setLocale] = useState(i18n.language)
  const [signedIn, setSignedIn] = useState(false)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  i18n.on('languageChanged', () => setLocale(i18n.language))

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <Suspense fallback={<Loading />}>
        <Helmet
          htmlAttributes={{
            lang: locale,
          }}
        >
          <style>{'body { background-color: #e1eced; color: #043C6C  }'}</style>
        </Helmet>
        <div
          style={{
            margin: 'auto',
            maxWidth: '1024px',
            position: 'relative',
            minHeight: '100vh',
            direction: locale === 'ar' ? 'rtl' : 'ltr',
          }}
        >
          <Router>
            {!window.location.pathname.includes('admin') && (
              <>
                <Navigation />
                <div
                  style={{
                    paddingBottom: '2.5rem',
                    direction: locale === 'ar' ? 'rtl' : 'ltr',
                  }}
                >
                  <Routes>
                    <Route path="/trips" element={<Trips />} />
                    <Route path="/adventures" element={<Adventures />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/" element={<Welcome />} />
                    <Route path="*" element={<Error404 />} />
                  </Routes>
                </div>
                <Footer />
              </>
            )}
            {window.location.pathname.includes('admin') && (
              <AuthContext.Provider
                value={{
                  signedIn,
                  setSignedIn,
                  username,
                  setUsername,
                  password,
                  setPassword,
                }}
              >
                <Routes>
                  <Route path="/admin" element={<AdminHome />} />
                  <Route
                    path="/admin/trips"
                    element={signedIn ? <AdminTrips /> : <AdminHome />}
                  />
                  <Route path="*" element={<Error404 />} />
                </Routes>
              </AuthContext.Provider>
            )}
          </Router>
        </div>
      </Suspense>
    </LocaleContext.Provider>
  )
}

export default App
