import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
} from 'firebase/auth'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import auth from '../config/firebase'
import { useGlobal } from '../context/global'

const LoginModal = () => {
  const { t, lang } = useTranslation('common')
  const router = useRouter()
  const { setAlert, user } = useGlobal()
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const isAr = lang === 'ar'

  const closeModal = useCallback(() => {
    delete router.query.modal
    router.push(router)
  }, [router])

  useEffect(() => {
    if (emailSent) {
      localStorage.setItem('emailForSignIn', email)
      closeModal()
    }
  }, [email, emailSent, closeModal])

  useEffect(() => {
    user && closeModal()
  }, [user, closeModal])

  const googleProvider = new GoogleAuthProvider()
  const facebookProvider = new FacebookAuthProvider()

  return (
    <Modal show onHide={() => closeModal()} dir={isAr ? 'rtl' : 'ltr'}>
      <Modal.Header closeButton>
        <Modal.Title>{t('login')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {t('email')}
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="name@outlook.com"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          className="w-full mt-3 py-2"
          onClick={() =>
            sendSignInLinkToEmail(auth, email, {
              url: window.location.origin,
              handleCodeInApp: true,
            })
              .catch((error) =>
                setAlert?.({
                  type: 'warning',
                  message: t('failedToSendEmail', {
                    msg: error.message,
                  }),
                })
              )
              .then(() => {
                setEmailSent(true)
                setAlert?.({ type: 'light', message: t('checkEmail') })
              })
          }
        >
          {t('emailLogin')}
        </Button>
        <Modal.Footer className="flex flex-col items-end gap-2">
          <div>{t('orSocialLogin')}</div>
          <div>
            <button
              type="button"
              className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
              onClick={() =>
                signInWithPopup(auth, googleProvider)
                  .then((result) => {
                    setAlert?.({
                      type: 'success',
                      message: t('successLogin', {
                        name: result.user.displayName,
                      }),
                    })
                  })
                  .catch((error) =>
                    setAlert?.({
                      type: 'warning',
                      message: t('failedToSocialLogin', {
                        msg: error.message,
                      }),
                    })
                  )
              }
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
              onClick={() =>
                signInWithPopup(auth, facebookProvider)
                  .then((result) => {
                    setAlert?.({
                      type: 'success',
                      message: t('successLogin', {
                        name: result.user.displayName,
                      }),
                    })
                  })
                  .catch((error) =>
                    setAlert?.({
                      type: 'warning',
                      message: t('failedToSocialLogin', {
                        msg: error.message,
                      }),
                    })
                  )
              }
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="facebook-f"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  fill="currentColor"
                  d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
                ></path>
              </svg>
            </button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default LoginModal
