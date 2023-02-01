import { useEffect, useMemo, createContext, useContext, useState } from "react"

import { Session } from "next-auth"
import { useSession } from 'next-auth/react'
import Client from "../components/Client"

import { defaultUser } from "../types/types"
import type { User } from "../types/types"

interface ClientContextType {
  client: Client
  session: any
  jwt: string
  user: User
}

interface ClientProviderProps {
  children: React.ReactNode
}

const ClientContext = createContext<ClientContextType>({client: (new Client()), session: {}, jwt: "", user: defaultUser})

export function ClientProvider({ children }: ClientProviderProps) {
  const session:any = useSession({ required: false })
  const jwt = session?.data?.authorization
  const client = useMemo(() => (new Client({ jwt })), [jwt])
  const user = session?.data?.user

  return (
    <ClientContext.Provider value={{client, session, jwt, user }}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClient(): ClientContextType {
  return useContext(ClientContext)
}
