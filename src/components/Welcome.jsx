import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

function Welcome() {
  const { t } = useTranslation()

  return (
    <Container
      style={{
        height: '50vh',
        lineHeight: '50vh',
        textAlign: 'center',
        userSelect: 'none',
        fontSize: '3rem',
      }}
    >
      {t('welcome')}
    </Container>
  )
}

export default Welcome
