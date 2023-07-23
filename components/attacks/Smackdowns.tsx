import React from "react"
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import { Button, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { FightActions } from "../../reducers/fightState"
import type { Character, ActionValues } from "../../types/types"
import type { AttackState } from "../../reducers/attackState"
import CS from "../../services/CharacterService"
import AS from "../../services/ActionService"

interface SmackdownsParams {
  state: AttackState
  handleClose: () => void
}

export default function Smackdowns({ state, handleClose }: SmackdownsParams) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { fight, dispatch } = useFight()

  const { target, mookResults } = state

  const damageMessage = (st: AttackState) => {
    const originalToughness = CS.rawActionValue(target, "Toughness")
    const toughness = CS.toughness(target)
    const outcome = st.outcome
    const smackdown = st.smackdown
    const wounds = st.wounds
    const toughnessDisplay = (st.toughness < originalToughness) ? (<><strong style={{color: "red"}}>{toughness}</strong> ({target.action_values["Toughness"]})</>) : toughness
    const toughnessMessage = (st.toughness) ? (<> - Toughness {toughnessDisplay} = <strong style={{color: "red"}}>{wounds} Wounds</strong></>) : ""

    return (<>{st.actionResult}: Smackdown of {st.smackdown} {toughnessMessage}</>)
  }

  const applyWounds = async () => {
    const updatedEnemy = CS.takeRawWounds(target, total)

    try {
      await client.updateCharacter(updatedEnemy, fight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`${target.name} took ${total} wounds.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  const successfulRolls = mookResults.filter((attackRoll: AttackState) => attackRoll.success)
  const total = AS.totalWounds({ attackRolls: successfulRolls, toughness: CS.toughness(target) })

  return (<>
    { successfulRolls.length > 0 && target.name && <Typography variant="h5" py={2}>{target.name}</Typography> }
    {
      successfulRolls
      .map((attackRoll: AttackState, index: number) => {
        const message = damageMessage(attackRoll)
        return (<React.Fragment key={(Math.random() * 10000)}><Typography component="span">{message}</Typography><br /></React.Fragment>)
      })
    }
    { target?.id && total > 0 && <Typography variant="h5" py={2} sx={{color: "red"}}>Total Wounds: {total}</Typography> }
    { target?.id && total > 0 && <Button endIcon={<HeartBrokenIcon />} variant="contained" color="error" onClick={applyWounds}>Apply Wounds</Button> }
    </>
  )
}
