const base = 'https://omanosaura.com'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { GetServerSideProps } from 'next'
import { BlogPreface, Product } from '../types/requests'

function generateSiteMap(blogs: BlogPreface[], products: Product[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://omanosaura.com</loc>
     </url>
     <url>
       <loc>https://omanosaura.com/blogs</loc>
     </url>
     <url>
       <loc>https://omanosaura.com/experiences</loc>
     </url>
     <url>
       <loc>https://omanosaura.com/contact</loc>
     </url>
     <url>
       <loc>https://omanosaura.com/about</loc>
     </url>
     ${blogs
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${base}/blogs/${id}`}</loc>
       </url>
     `
       })
       .join('')}
     ${products
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${base}/experiences/${id}`}</loc>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // We make an API call to gather the URLs for our site
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: blogs }: AxiosResponse<BlogPreface[]> = await axios.get(
    `${process.env.SERVER_URL}blogs`
  )
  const { data: products }: AxiosResponse<Product[]> = await axios.get(
    `${process.env.SERVER_URL}products`
  )

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(blogs, products)

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
