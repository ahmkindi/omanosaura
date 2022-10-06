import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'

const axiosServer = applyConverters(
  axiosStatic.create({ baseURL: '/api/' }) as any
) as AxiosInstance

export const fetcher = async <T>(url: string) => {
  const { data }: AxiosResponse<T> = await axiosServer.get(url)
  return data
}

export default axiosServer
