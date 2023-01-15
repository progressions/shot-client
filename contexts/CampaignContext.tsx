import { useEffect, useMemo, createContext, useContext, useState } from "react"

import type { Campaign } from "../types/types"
import { defaultCampaign } from "../types/types"
import { useSession } from 'next-auth/react'
import Client from "../components/Client"

export type CampaignContextType = [
  Campaign,
  any
]

const CampaignContext = createContext<CampaignContextType>({})

export function CampaignProvider({ children }: any) {
  const session: any = useSession({ required: false })
  const jwt = session?.data?.authorization
  const client = useMemo(() => (new Client({ jwt })), [jwt])

  const [campaign, setCampaign] = useState<Campaign>(defaultCampaign)

  const setCurrentCampaign = async (camp) => {
    const response = await client.setCurrentCampaign(camp)
    if (response.status === 200) {
      const data = await response.json()
      console.log({ data })
      setCampaign(data)
      return data
    }
  }

  const getCurrentCampaign = async () => {
    const response = await client.getCurrentCampaign()
    if (response.status === 200) {
      const data = await response.json()
      console.log("DATA", { data })
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
