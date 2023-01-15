import { createContext, useContext, useState } from "react"

import type { Campaign } from "../types/types"
import { defaultCampaign } from "../types/types"

export type CampaignContextType = [
  Campaign,
  any
]

const CampaignContext = createContext<CampaignContextType>([defaultCampaign, ()=>{}])

export function CampaignProvider({ children }: any) {
  const [campaign, setCampaign] = useState<Campaign>(defaultCampaign)

  return (
    <CampaignContext.Provider value={[campaign, setCampaign]}>
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaign() {
  return useContext(CampaignContext)
}
