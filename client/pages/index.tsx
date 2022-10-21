import type { NextPage } from 'next'
import useSWR from 'swr'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import Smartphone from '../components/Smartphone'
import { Product } from '../types/requests'
import { fetcher } from '../utils/axiosServer'

const Home: NextPage = () => {
  const { data: products} = useSWR('products', fetcher<Product[]>)
  if (!products) return null
  return (
    <Layout>
      <ProductCard product={products[products.length-1]} />
      <Smartphone />
    </Layout>
  )
}

export default Home
