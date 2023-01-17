import { useEffect, useMemo, createContext, useContext, useState } from "react"

import { useSession } from 'next-auth/react'
import Client from "../components/Client"

import { defaultUser } from "../types/types"
import type { User } from "../types/types"

interface ClientContextParams {
  client: Client
  session: any
  jwt: string
  user: User
}

const ClientContext = createContext<ClientContextParams>({client: (new Client()), session: {}, jwt: "", user: defaultUser})

export function ClientProvider({ children }: any) {
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

export function useClient() {
  return useContext(ClientContext)
}
