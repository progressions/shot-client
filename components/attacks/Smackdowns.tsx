import React from "react"
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import { Button, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"
import { useToast } from "@/contexts/ToastContext"
import { FightActions } from "@/reducers/fightState"
import type { Character, ActionValues } from "@/types/types"
import type { MookResult, AttackState } from "@/reducers/attackState"
import CS from "@/services/CharacterService"
import AS from "@/services/ActionService"
import CES from "@/services/CharacterEffectService"
import { colorForValue } from "@/components/characters/ActionValueDisplay"

interface SmackdownsParams {
  state: AttackState
  handleClose: () => void
}

export default function Smackdowns({ state, handleClose }: SmackdownsParams) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { fight, dispatch } = useFight()

  const { wounds, target, mookResults } = state

  const [changed, adjustedToughness] = CES.adjustedActionValue(target, "Toughness", fight, false)
  const toughness = state.toughness ? state.toughness : adjustedToughness
  const color = (toughness < CS.toughness(target)) ? "red" : (toughness > CS.toughness(target)) ? "green" : "inherit"

  const damageMessage = (st: MookResult) => {
    const smackdown = st.smackdown
    const wounds = st.wounds
    const toughnessDisplay = (<><strong style={{color: color}}>{toughness}</strong> ({CS.toughness(target)})</>)
    const toughnessMessage = (state.toughness) ? (<> - Toughness {toughnessDisplay} = <strong style={{color: "red"}}>{wounds || 0} Wounds</strong></>) : ""

    return (<>{st.actionResult}: Smackdown of {st.smackdown} {toughnessMessage}</>)
  }

  const successfulRolls = mookResults.filter((attackRoll: MookResult) => attackRoll.success)

  return (<>
    { successfulRolls.length > 0 && target.name && <Typography variant="h5" py={2}>{target.name}</Typography> }
    {
      successfulRolls
      .map((attackRoll: MookResult, index: number) => {
        const message = damageMessage(attackRoll)
        return (<React.Fragment key={(Math.random() * 10000)}><Typography component="span">{message}</Typography><br /></React.Fragment>)
      })
    }
    { target?.id && !!wounds && <Typography variant="h5" py={2} sx={{color: "red"}}>Total Wounds: {wounds}</Typography> }
    </>
  )
}
