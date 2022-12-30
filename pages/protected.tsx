import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Router from 'next/router'

export default function Protected() {
  const { status, data } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      Router.replace("/auth/signin")
    }
  }, [status])

  if (status === "authenticated") {
    return (
      <>
        <h1>Protected</h1>
      </>
    )
  }
  return <p>Loading...</p>
}
