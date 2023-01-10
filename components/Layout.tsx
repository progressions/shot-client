import Navbar from './Navbar'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Router from 'next/router'

interface LayoutProps {
  unauthenticated?: boolean,
  children: React.ReactNode
}

export default function Layout({ unauthenticated, children }: LayoutProps) {
  const { status, data } = useSession()

  useEffect(() => {
    if (!unauthenticated && status === "unauthenticated") {
      Router.replace("/auth/signin")
    }
  })

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
