import { Link } from 'react-router-dom'

//TODO: Better styling and move to class
const AdminNavigation = () => {
  return (
    <div
      style={{
        display: 'flex',
        color: 'black',
        fontSize: '1.5rem',
        gap: '1.5rem',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0.5rem 1rem',
      }}
    >
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
  )
}

export default AdminNavigation
