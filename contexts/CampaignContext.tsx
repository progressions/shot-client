import { useEffect, useMemo, createContext, useContext, useState } from "react"

import type { Campaign } from "../types/types"
import { defaultCampaign } from "../types/types"
import { useSession } from 'next-auth/react'
import { useClient } from "./ClientContext"
import { useLocalStorage } from "./LocalStorageContext"

export interface CampaignContextType {
  campaign: Campaign | null
  setCurrentCampaign: any
  getCurrentCampaign: any
}

const CampaignContext = createContext<CampaignContextType>({ campaign: null, setCurrentCampaign: null, getCurrentCampaign: null })

export function CampaignProvider({ children }: any) {
  const { user, client } = useClient()
  const { saveLocally, getLocally } = useLocalStorage()

  const [campaign, setCampaign] = useState<Campaign>(defaultCampaign)

  const setCurrentCampaign = async (camp: Campaign | null) => {
    const response = await client.setCurrentCampaign(camp)
    if (response.status === 200) {
      const data = await response.json()
      setCampaign(data)
      saveLocally("currentCampaign", data)
      return data
    }
  }

  const getCurrentCampaign = async () => {
    const data = getLocally("currentCampaign")
    if (data) {
      setCampaign(data)
      return data
    }
    const response = await client.getCurrentCampaign()
    if (response.status === 200) {
      const data = await response.json()
      setCampaign(data)
      return data
    }
    return null
  }

  useEffect(() => {
    if (user) {
      const data = getLocally("currentCampaign")
      if (data) {
        setCampaign(data)
      } else {
        const data = getCurrentCampaign().catch(console.error)
        saveLocally("currentCampaign", data)
      }
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
