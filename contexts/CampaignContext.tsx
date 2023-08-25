import { useEffect, useMemo, createContext, useContext, useState } from "react"

import type { Campaign } from "@/types/types"
import { defaultCampaign } from "@/types/types"
import { useClient } from "@/contexts/ClientContext"
import { useLocalStorage } from "@/contexts/LocalStorageContext"

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
    const data = getLocally(`currentCampaign-${user?.id}`)
    if (data) {
      setCampaign(data as Campaign)
      return data as Campaign
    }
    try {
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

    const data = getLocally(`currentCampaign-${user?.id}`)
    if (data) {
      setCampaign(data as Campaign)
      return
    }

    try {
      const data = getCurrentCampaign()
      saveLocally(`currentCampaign-${user?.id}`, data)
    } catch(error) {
      console.error(error)
    }
  }, [user])

  return (
    <CampaignContext.Provider value={{campaign, setCurrentCampaign, getCurrentCampaign}}>
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaign() {
  return useContext(CampaignContext)
}
