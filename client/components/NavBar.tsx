import React from 'react'
import useUser from '../hooks/useUser'

const NavBar = () => {
  const { user, isLoading, login, logout } = useUser()
  if (isLoading) {
    return null
  }
  if (user) {
    return <div onClick={() => logout()}>{user.email}</div>
  }
  return <div onClick={() => login()}>Login</div>
}

export default NavBar

/* import { signIn, useSession } from 'next-auth/react' */
/* import React from 'react' */
/**/
/* const NavBar = () => { */
/*   const { data: session, status } = useSession() */
/**/
/*   if (status === 'loading') { */
/*     return null */
/*   } */
/*   if (session) { */
/*     return <div>{session.user?.name}</div> */
/*   } */
/*   return ( */
/*     <a */
/*       href={`/api/auth/signin`} */
/*       onClick={(e) => { */
/*         e.preventDefault() */
/*         signIn() */
/*       }} */
/*     > */
/*       Sign in */
/*     </a> */
/*   ) */
/* } */
/**/
/* export default NavBar */
