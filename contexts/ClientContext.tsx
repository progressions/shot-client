import { useEffect, useMemo, createContext, useContext, useState } from "react"

import { Session } from "next-auth"
import { useSession } from 'next-auth/react'
import Client from "../components/Client"

import { defaultUser } from "../types/types"
import type { AuthSession, User } from "../types/types"

interface ClientContextType {
  client: Client
  session: AuthSession
  jwt: string
  user: User
}

interface ClientProviderProps {
  children: React.ReactNode
}

const ClientContext = createContext<ClientContextType>({client: (new Client()), session: {} as AuthSession, jwt: "", user: defaultUser})

export function ClientProvider({ children }: ClientProviderProps) {
  const session = useSession({ required: false }) as AuthSession
  const jwt = session?.data?.authorization as string
  const client = useMemo(() => (new Client({ jwt })), [jwt])
  const user = session?.data?.user as User

  return (
    <ClientContext.Provider value={{client, session, jwt, user }}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClient(): ClientContextType {
  return useContext(ClientContext)
}
