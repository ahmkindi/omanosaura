import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

function Welcome() {
  const { t } = useTranslation()

  return (
    <Container
      style={{
        height: '90vh',
        lineHeight: '90vh',
        textAlign: 'center',
        userSelect: 'none',
        fontSize: '3rem',
        opacity: '0.5',
      }}
    >
      {t('welcome')}
    </Container>
  )
}

export default Welcome
