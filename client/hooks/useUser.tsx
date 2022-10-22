import { useRouter } from 'next/router'
import useSWR from 'swr'
import { User } from '../types/requests'
import axiosServer, { fetcher } from '../utils/axiosServer'

const useUser = () => {
  const { data, error } = useSWR('user', fetcher<User>, {
    revalidateIfStale: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false
  })
  const router = useRouter()

  return {
    user: data,
    isLoading: !data && !error,
    logout: async () => {
        const response = await axiosServer.get(`user/logout?redirect=${router.pathname}`)
        router.push(response.request.responseURL)
      },
    login: async () => {
        const response = await axiosServer.get(`login?redirect=${router.pathname}`)
        router.push(response.request.responseURL)
      }
  }
}

export default useUser
