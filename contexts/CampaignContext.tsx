import { useEffect, useMemo, createContext, useContext, useState } from "react"

import type { Campaign } from "../types/types"
import { defaultCampaign } from "../types/types"
import { useSession } from 'next-auth/react'
import Client from "../components/Client"

export interface CampaignContextType {
  campaign: Campaign | null
  setCurrentCampaign: any
  getCurrentCampaign: any
}

const CampaignContext = createContext<CampaignContextType>({ campaign: null, setCurrentCampaign: null, getCurrentCampaign: null })

export function CampaignProvider({ children }: any) {
  const session: any = useSession({ required: false })
  const jwt = session?.data?.authorization
  const client = useMemo(() => (new Client({ jwt })), [jwt])

  const [campaign, setCampaign] = useState<Campaign>(defaultCampaign)

  const setCurrentCampaign = async (camp: Campaign | null) => {
    const response = await client.setCurrentCampaign(camp)
    if (response.status === 200) {
      const data = await response.json()
      setCampaign(data)
      return data
    }
  }

  const getCurrentCampaign = async () => {
    const response = await client.getCurrentCampaign()
    if (response.status === 200) {
      const data = await response.json()
      setCampaign(data)
      return data
    }
    return null
  }

  useEffect(() => {
    if (jwt) {
      const getIt = async () => {
        return await getCurrentCampaign()
      }

      getIt().catch(console.error)
    }
  }, [jwt])

  return (
    <CampaignContext.Provider value={{campaign, setCurrentCampaign, getCurrentCampaign}}>
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaign() {
  return useContext(CampaignContext)
}
