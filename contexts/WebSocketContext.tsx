import { createContext, useContext, useEffect, useState } from "react"
import type { Viewer } from "@/types/types"
import { useFight } from "@/contexts/FightContext"
import { FightActions } from "@/reducers/fightState"
import { useClient } from "@/contexts/ClientContext"

interface WebSocketContextType {
  viewingUsers: Viewer[]
}

interface WebSocketProviderProps {
  children: React.ReactNode
}

interface FightChannelMessage {
  fight?: string
  users?: Viewer[]
}

const WebSocketContext = createContext<WebSocketContextType>({
  viewingUsers: [],
})

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { client } = useClient()
  const { fight, dispatch } = useFight()
  const [viewingUsers, setViewingUsers] = useState<Viewer[]>([])

  useEffect(() => {
    if (!fight?.id) {
      console.log("Skipping subscription: fight.id is null")
      return
    }

    console.log("Subscribing to FightChannel for fight:", fight.id, "type:", typeof fight.id)
    const consumer = client.consumer()
    const subscription = consumer.subscriptions.create(
      { channel: "FightChannel", fight_id: fight.id },
      {
        connected: () => console.log("Connected to FightChannel"),
        disconnected: () => console.log("Disconnected from FightChannel"),
        received: (data: FightChannelMessage) => {
          if (data.fight === "updated") {
            dispatch({ type: FightActions.EDIT })
          } else if (data.users) {
            setViewingUsers(data.users)
          }
        },
      }
    )

    return () => {
      console.log("Unsubscribing from FightChannel for fight_id:", fight.id)
      subscription.unsubscribe()
    }
  }, [fight?.id, dispatch, client])

  return (
    <WebSocketContext.Provider value={{ viewingUsers }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket(): WebSocketContextType {
  return useContext(WebSocketContext)
}
