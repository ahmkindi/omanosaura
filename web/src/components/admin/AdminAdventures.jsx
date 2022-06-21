import AuthContext from '../../AuthContext'
import { Table, Button } from 'react-bootstrap'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import useSWR from 'swr'
import axios from 'axios'
import { useContext, useState } from 'react'
import EditAdventure from './EditAdventure'
import LoadingContext from '../../LoadingContext'
import styles from './admin.module.scss'

export const emptyAdventure = {
  title: '',
  title_ar: '',
  description: '',
  description_ar: '',
  photo: '',
}

const AdminAdventures = () => {
  const { data: adventures, mutate } = useSWR(
    '/api/adventures',
    async (url) => {
      const { data } = await axios.get(url)
      return data
    }
  )
  const { username, password } = useContext(AuthContext)
  const [activeAdv, setActiveAdv] = useState()
  const { setIsLoading } = useContext(LoadingContext)

  const handleDelete = async (advId) => {
    setIsLoading(true)
    await axios.post(
      `/api/admin/adventures/delete/${advId}`,
      {},
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    await mutate(adventures)
    setIsLoading(false)
  }

  if (activeAdv)
    return <EditAdventure activeAdv={activeAdv} setActiveAdv={setActiveAdv} />
  return (
    <div className={styles.adminPage}>
      <Button onClick={() => setActiveAdv(emptyAdventure)}>
        New Adventure
      </Button>
      <Table striped bordered hover style={{ margin: '2rem' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>AR Title</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {adventures?.map((adv, index) => (
            <tr key={adv.id}>
              <td>{index + 1}</td>
              <td>{adv.title}</td>
              <td>{adv.title_ar}</td>
              <td>
                <Button variant="primary" onClick={() => setActiveAdv(adv)}>
                  <AiOutlineEdit />
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={async () => await handleDelete(adv.id)}
                >
                  <AiOutlineDelete />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default AdminAdventures
