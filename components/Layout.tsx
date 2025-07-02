import Navbar from '@/components/navbar/Navbar'
import { Box } from "@mui/material"
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { PopupProvider } from "@/contexts/PopupContext"

import { useSession } from 'next-auth/react'
import { useRef, useEffect } from 'react'
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
    <Box>
      <PopupProvider>
        <Navbar />
        {children}
      </PopupProvider>
    </Box>
  )
}
