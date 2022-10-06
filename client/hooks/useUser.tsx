import useSWR from 'swr'
import { User } from '../types/requests'
import axiosServer, { fetcher } from '../utils/axiosServer'

const useUser = () => {
  const { data, error, mutate } = useSWR('user', fetcher<User>)

  return {
    user: data,
    isLoading: !data && !error,
    logout: async (redirectUri: string) => {
        console.log(redirectUri)
        await axiosServer.get(`logout`)
        await mutate()
      },
    login: async (redirectUri: string) => {
        console.log(redirectUri)
        const response = await axiosServer.get(`login`)
        console.log(response.request.responseURL)
        await mutate()
      }
  }
}

export default useUser
