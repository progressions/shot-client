import { useReducer, useEffect, useMemo, createContext, useContext, useState } from "react"

import { Session } from "next-auth"
import { useSession } from 'next-auth/react'
import Client from "@/utils/Client"
import Api from "@/utils/Api"

import { defaultUser } from "@/types/types"
import type { AuthSession, User } from "@/types/types"
import { UserActions, userReducer, initialUserState } from "@/reducers/userState"
import type { UserStateType } from "@/reducers/userState"

interface ClientContextType {
  client: Client
  session: AuthSession
  jwt: string
  user: User
  currentUserState: UserStateType
  dispatchCurrentUser: React.Dispatch<any>
}

interface ClientProviderProps {
  children: React.ReactNode
}

const ClientContext = createContext<ClientContextType>({client: (new Client()), session: {} as AuthSession, jwt: "", user: defaultUser, currentUserState: initialUserState, dispatchCurrentUser: () => {}})

export function ClientProvider({ children }: ClientProviderProps) {
  const session = useSession({ required: false }) as any
  const jwt = session?.data?.authorization as string
  const client = useMemo(() => (new Client({ jwt })), [jwt])
  const user = session?.data?.user as User

  const [state, dispatch] = useReducer(userReducer, initialUserState)

  useEffect(() => {
    if (!user?.id) return

    client.getUser(user).then((data) => {
      dispatch({ type: UserActions.USER, payload: data })
    }).catch((error) => {
      console.error("Error fetching user data:", error)
    })
  }, [user, client])

  return (
    <ClientContext.Provider value={{client, session, jwt, user, currentUserState: state, dispatchCurrentUser: dispatch }}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClient(): ClientContextType {
  return useContext(ClientContext)
}
