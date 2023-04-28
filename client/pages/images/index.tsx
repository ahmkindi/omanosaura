import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import Layout from '../../components/Layout'
import { useGlobal } from '../../context/global'
import { UserRole } from '../../types/requests'
import axiosServer from '../../utils/axiosServer'
import { humanFileSize } from '../../utils/bytes'
import { AiOutlineClose } from 'react-icons/ai'

const Page = () => {
  const { user, isLoading } = useGlobal()
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const upload = async () => {
    try {
      setLoading(true)

      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })
      await axiosServer.post('user/admin/products/media', formData)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.admin) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <Spinner className="items-center justify-center" />
  }

  return (
    <Layout title="Upload">
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>Maximum of 10MB, ensure file names are unique</Form.Label>
        <Form.Control
          type="file"
          multiple
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            e.target.files && setFiles(Array.from(e.target.files))
          }
        />
      </Form.Group>
      <Button onClick={() => upload()} disabled={loading}>
        {loading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          'Upload'
        )}
      </Button>
      <div className="flex gap-3 flex-wrap mt-3">
        {files.map((f, i) => (
          <div
            key={`file-${f.name}`}
            className="p-3 bg-[#fff] rounded shadow-md"
          >
            <h3>{f.name}</h3>
            <h6>{humanFileSize(f.size)}</h6>
            <AiOutlineClose
              className="cursor-pointer"
              onClick={() =>
                setFiles((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)])
              }
            />
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Page
