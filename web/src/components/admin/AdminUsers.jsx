import AuthContext from '../../AuthContext'
import { Table } from 'react-bootstrap'
import useSWR from 'swr'
import axios from 'axios'
import { useContext } from 'react'

const AdminUsers = () => {
  const { username, password } = useContext(AuthContext)
  const { data: users } = useSWR('/users', async (url) => {
    const { data } = await axios.get(url, {
      auth: { username: username, password: password },
    })
    return data
  })

  return (
    <Table striped bordered style={{ margin: '2rem' }}>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default AdminUsers
