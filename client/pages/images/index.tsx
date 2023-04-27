import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Form } from 'react-bootstrap'
import Layout from '../../components/Layout'
import { useGlobal } from '../../context/global'
import { UserRole } from '../../types/requests'

const Page = () => {
  const { user, isLoading } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.admin) {
      router.push('/')
    }
  }, [user, isLoading, router])

  return (
    <Layout title="upload">
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>Multiple image upload</Form.Label>
        <Form.Control type="file" multiple />
      </Form.Group>
    </Layout>
  )
}

export default Page
