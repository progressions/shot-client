import { useEffect, useMemo, createContext, useContext, useState } from "react"

import { Session } from "next-auth"
import { useSession } from 'next-auth/react'
import Client from "@/utils/Client"
import Api from "@/utils/Api"

import { defaultUser } from "@/types/types"
import type { AuthSession, User } from "@/types/types"

interface ClientContextType {
  client: Client
  session: AuthSession
  jwt: string
  user: User
  api: Api
}

interface ClientProviderProps {
  children: React.ReactNode
}

const ClientContext = createContext<ClientContextType>({client: (new Client()), session: {} as AuthSession, jwt: "", user: defaultUser, api: (new Api())})

export function ClientProvider({ children }: ClientProviderProps) {
  const session = useSession({ required: false }) as any
  const jwt = session?.data?.authorization as string
  const client = useMemo(() => (new Client({ jwt })), [jwt])
  const user = session?.data?.user as User
  const api = useMemo(() => (new Api({ jwt })), [jwt])

  return (
    <ClientContext.Provider value={{client, session, jwt, user, api }}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClient(): ClientContextType {
  return useContext(ClientContext)
}
