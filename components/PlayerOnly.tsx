import type { Campaign, User, Character } from "@/types/types"
import { useCampaign } from "@/contexts/CampaignContext"

interface PlayerOnlyProps {
  user: User | null
  character?: Character
  campaign?: Campaign
  override?: boolean
}

export default function PlayerOnly({ user, children, character, override }: React.PropsWithChildren<PlayerOnlyProps>) {
  const { campaign } = useCampaign()

  if (campaign.gamemaster?.id !== user?.id && character && ["PC", "Ally"].includes(character.action_values['Type'] as string)) {
    // if the character is a PC or Ally, show the content
    return (<>{ children }</>)
  } else if (campaign?.id && campaign.gamemaster?.id !== user?.id && !user?.gamemaster) {
    // if the current user is the gamemaster of the current campaign
    return (<>{ children }</>)
  } else if (!campaign?.id && user?.gamemaster) {
    // if there is no current campaign and the user is a gamemaster
    return (<>{ children }</>)
  } else if (override) {
    // if the override condition is true
    return (<>{ children }</>)
  } else {
    // otherwise hide the content
    return <></>
  }
}

