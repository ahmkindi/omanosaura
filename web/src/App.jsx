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
import {
  AdminHome,
  AdminTrips,
  AdminAdventures,
  AdminEvents,
  AdminUsers,
  AdminTripPhotos,
  AdminNavigation,
} from './components/admin'
import i18n from './i18n'
import LocaleContext from './LocaleContext'
import AuthContext from './AuthContext'
import LoadingContext from './LoadingContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const [locale, setLocale] = useState(i18n.language)
  const [signedIn, setSignedIn] = useState(false)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
              <LoadingContext.Provider
                value={{
                  isLoading,
                  setIsLoading,
                }}
              >
                <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <div
                  style={{
                    paddingBottom: '2.5rem',
                    direction: locale === 'ar' ? 'rtl' : 'ltr',
                  }}
                >
                  <Routes>
                    <Route
                      path="/trips"
                      element={<Trips setMenuOpen={setMenuOpen} />}
                    />
                    <Route path="/adventures" element={<Adventures />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/" element={<Welcome />} />
                    <Route path="*" element={<Error404 />} />
                  </Routes>
                </div>
                <Footer />
              </LoadingContext.Provider>
            )}
            {window.location.pathname.includes('admin') && (
              <LoadingContext.Provider
                value={{
                  isLoading,
                  setIsLoading,
                }}
              >
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
                  {signedIn && <AdminNavigation />}
                  <div style={{ padding: '0.5rem', direction: 'ltr' }}>
                    <Routes>
                      <Route path="/admin" element={<AdminHome />} />
                      <Route
                        path="/admin/trips"
                        element={signedIn ? <AdminTrips /> : <AdminHome />}
                      />
                      <Route
                        path="/admin/trip/photos/:id"
                        element={signedIn ? <AdminTripPhotos /> : <AdminHome />}
                      />
                      <Route
                        path="/admin/adventures"
                        element={signedIn ? <AdminAdventures /> : <AdminHome />}
                      />
                      <Route
                        path="/admin/events"
                        element={signedIn ? <AdminEvents /> : <AdminHome />}
                      />
                      <Route
                        path="/admin/users/:id"
                        element={signedIn ? <AdminUsers /> : <AdminHome />}
                      />
                      <Route path="*" element={<Error404 />} />
                    </Routes>
                  </div>
                </AuthContext.Provider>
              </LoadingContext.Provider>
            )}
          </Router>
        </div>
      </Suspense>
    </LocaleContext.Provider>
  )
}

export default App
