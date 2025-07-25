import React from "react"
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import { Button, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"
import { useToast } from "@/contexts/ToastContext"
import { FightActions } from "@/reducers/fightState"
import type { Character, ActionValues } from "@/types/types"
import type { ChaseMookResult, ChaseState } from "@/reducers/chaseState"
import VS from "@/services/VehicleService"
import AS from "@/services/ActionService"
import FES from "@/services/FightEventService"

interface SmackdownsParams {
  state: ChaseState
  handleClose: () => void
}

export default function Smackdowns({ state, handleClose }: SmackdownsParams) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { fight, dispatch } = useFight()

  const { attacker, chasePoints, conditionPoints, target, mookResults, method, shots } = state

  const damageMessage = (st: ChaseMookResult) => {
    const originalHandling = VS.rawActionValue(target, "Handling")
    const handling = VS.handling(target)
    const smackdown = st.smackdown
    const chasePoints = st.chasePoints
    const handlingDisplay = (state.handling < originalHandling) ? (<><strong style={{color: "red"}}>{handling}</strong> ({target.action_values["Handling"]})</>) : handling
    const handlingMessage = (state.handling) ? (<> - Handling {handlingDisplay} = <strong style={{color: "red"}}>{chasePoints || 0} Chase Points</strong></>) : ""

    return (<>Smackdown of {st.smackdown} {handlingMessage}</>)
  }

  const applyWounds = async () => {
    try {
      await client.updateVehicle(target, fight)
      await client.updateVehicle(attacker, fight)
      await FES.chaseAttack(client, fight, attacker, target, chasePoints || 0, conditionPoints || 0, method, shots)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`${target.name} took ${chasePoints} Chase Points and ${conditionPoints} Condition Points.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  const successfulRolls = mookResults.filter((attackRoll: ChaseMookResult) => attackRoll.success)

  return (<>
    { successfulRolls.length > 0 && target.name && <Typography variant="h5" py={2}>{target.name}</Typography> }
    {
      successfulRolls
      .map((attackRoll: ChaseMookResult, index: number) => {
        const message = damageMessage(attackRoll)
        return (<React.Fragment key={(Math.random() * 10000)}><Typography component="span">{message}</Typography><br /></React.Fragment>)
      })
    }
    {
      target?.id && (chasePoints || 0) > 0 &&
      <Typography variant="h5" py={2} sx={{color: "red"}}>
        Total Chase Points: {chasePoints}
      </Typography> }
      { target?.id && (chasePoints || 0) > 0 &&
      <Button endIcon={<HeartBrokenIcon />} variant="contained" color="error" onClick={applyWounds}>
        Apply Results
    </Button> }
    </>
  )
}
