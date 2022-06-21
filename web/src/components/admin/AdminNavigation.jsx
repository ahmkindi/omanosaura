import { useContext } from 'react'
import { Link } from 'react-router-dom'
import LoadingContext from '../../LoadingContext'
import ReactLoading from 'react-loading'
import styles from './admin.module.scss'

const AdminNavigation = () => {
  const { isLoading } = useContext(LoadingContext)
  return (
    <>
      <div className={styles.navbar}>
        <Link style={{ color: 'black' }} to="/admin/trips">
          trips
        </Link>
        <Link style={{ color: 'black' }} to="/admin/adventures">
          adventures
        </Link>
        <Link style={{ color: 'black' }} to="/admin/events">
          events
        </Link>
        <Link style={{ color: 'black' }} to="/admin/users/all">
          users
        </Link>
      </div>
      {isLoading && (
        <ReactLoading
          className={styles.loading}
          type="spin"
          color="blue"
          height={50}
          width={50}
        />
      )}
    </>
  )
}

export default AdminNavigation
