const base = 'https://omanosaura.com'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { GetServerSideProps } from 'next'
import { BlogPreface, Product } from '../types/requests'

function generateSiteMap(blogs: BlogPreface[], products: Product[]) {
  const generateUrlWithAlternates = (path: string) => `
    <url>
      <loc>${base}${path}</loc>
      <xhtml:link rel="alternate" hreflang="en" href="${base}${path}" />
      <xhtml:link rel="alternate" hreflang="ar" href="${base}/ar${path}" />
    </url>
  `

  const generateBlogUrls = () =>
    blogs
      .map(
        ({ id }) => `
      <url>
        <loc>${base}/blogs/${id}</loc>
        <xhtml:link rel="alternate" hreflang="en" href="${base}/blogs/${id}" />
        <xhtml:link rel="alternate" hreflang="ar" href="${base}/ar/blogs/${id}" />
      </url>
    `
      )
      .join('')

  const generateProductUrls = () =>
    products
      .map(
        ({ id }) => `
      <url>
        <loc>${base}/experiences/${id}</loc>
        <xhtml:link rel="alternate" hreflang="en" href="${base}/experiences/${id}" />
        <xhtml:link rel="alternate" hreflang="ar" href="${base}/ar/experiences/${id}" />
      </url>
    `
      )
      .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${generateUrlWithAlternates('')}
      ${generateUrlWithAlternates('/blogs')}
      ${generateUrlWithAlternates('/experiences')}
      ${generateUrlWithAlternates('/contact')}
      ${generateUrlWithAlternates('/about')}
      ${generateBlogUrls()}
      ${generateProductUrls()}
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
  console.log('sitemap', sitemap)

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
