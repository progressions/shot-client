import { useEffect, useMemo, createContext, useContext, useState } from "react"

import type { Campaign } from "@/types/types"
import { defaultCampaign } from "@/types/types"
import { useClient, useLocalStorage } from "@/contexts"

export interface CampaignContextType {
  campaign: Campaign | null
  setCurrentCampaign: (camp: Campaign | null) => Promise<Campaign | null>
  getCurrentCampaign: () => Promise<Campaign | null>
}

interface CampaignProviderProps {
  children: React.ReactNode
}

const defaultContext: CampaignContextType = {
  campaign: null,
  setCurrentCampaign: async (camp: Campaign | null) => { return new Promise(() => defaultCampaign) },
  getCurrentCampaign: async () => { return new Promise(() => defaultCampaign) }
}

const CampaignContext = createContext<CampaignContextType>(defaultContext)

export function CampaignProvider({ children }: CampaignProviderProps) {
  const { user, client } = useClient()
  const { saveLocally, getLocally } = useLocalStorage()
  const consumer = client.consumer()

  const [campaign, setCampaign] = useState<Campaign | null>(defaultCampaign)

  const setCurrentCampaign = async (camp: Campaign | null):Promise<Campaign | null> => {
    try {
      const data = await client.setCurrentCampaign(camp)
      setCampaign(data)
      saveLocally(`currentCampaign-${user?.id}`, data)
      return data
    } catch(error) {
      console.error(error)
    }
    return null
  }

  const getCurrentCampaign = async ():Promise<Campaign | null> => {
    try {
      const cachedCampaign = getLocally(`currentCampaign-${user?.id}`) as Campaign
      if (cachedCampaign) {
        setCampaign(cachedCampaign)
        return cachedCampaign as Campaign
      }
      const data = await client.getCurrentCampaign()
      setCampaign(data)
      return data as Campaign
    } catch(error) {
      console.error(error)
    }
    return null
  }

  useEffect(() => {
    if (!user) return

    try {
      getCurrentCampaign()
    } catch(error) {
      console.error(error)
    }
  }, [user])

  useEffect(() => {
    if (!user || !campaign?.id) return

    const subscription = consumer.subscriptions.create(
      { channel: "CampaignChannel", id: campaign.id },
      {
        connected: () => console.log("Connected to CampaignChannel"),
        disconnected: () => console.log("Disconnected from CampaignChannel"),
        received: (data: any) => {
          console.log("CampaignChannel data", data)
        },
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [user, campaign])

  return (
    <CampaignContext.Provider value={{campaign, setCurrentCampaign, getCurrentCampaign}}>
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaign() {
  return useContext(CampaignContext)
}
