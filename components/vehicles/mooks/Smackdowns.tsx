import React from "react"
import { Button, Typography } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useFight } from "../../../contexts/FightContext"
import { useToast } from "../../../contexts/ToastContext"
import { FightActions } from "../../../reducers/fightState"
import type { Vehicle, VehicleActionValues } from "../../../types/types"
import type { MookRollValue } from "./MookRolls"
import VS from "../../../services/VehicleService"
import AS, { AttackRollType } from "../../../services/ActionService"

interface SmackdownsParams {
  enemy: Vehicle
  attackRolls: AttackRollType[]
  value: MookRollValue
  handleClose: () => void
}

export default function Smackdowns({ enemy, attackRolls, value, handleClose }: SmackdownsParams) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { fight, dispatch } = useFight()

  const damageMessage = (enemy: Character, attackRoll: AttackRollType) => {
    const originalHandling = VS.rawActionValue(enemy, "Handling")
    const handling = VS.handling(enemy)
    const outcome = attackRoll.outcome
    const smackdown = attackRoll.smackdown
    const chasePoints = attackRoll.wounds
    const handlingDisplay = (handling < originalHandling) ? (<><strong style={{color: "red"}}>{handling}</strong> ({enemy.action_values["Handling"]})</>) : handling
    const handlingMessage = (handling) ? (<> - Handling {handlingDisplay} = <strong style={{color: "red"}}>{chasePoints} Wounds</strong></>) : ""

    return (<>{attackRoll.actionResult}: Smackdown of {smackdown} {handlingMessage}</>)
  }

  const applyChasePoints = async () => {
    const updatedEnemy = VS.takeRawChasePoints(enemy, total)
    try {
      await client.updateVehicle(updatedEnemy, fight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`${enemy.name} took ${total} Chase Points.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  const successfulRolls = attackRolls.filter((attackRoll: AttackRollType) => attackRoll.success)
  const total = AS.totalWounds({ attackRolls: successfulRolls, toughness: VS.handling(enemy) })

  return (<>
    { successfulRolls.length > 0 && enemy.name && <Typography variant="h5" py={2}>{enemy.name}</Typography> }
    {
      successfulRolls
      .map((attackRoll: AttackRollType, index: number) => {
        const message = damageMessage(enemy, attackRoll)
        return (<React.Fragment key={(Math.random() * 10000)}><Typography component="span">{message}</Typography><br /></React.Fragment>)
      })
    }
    { enemy?.id && total > 0 && <Typography variant="h5" py={2} sx={{color: "red"}}>Total Chase Points: {total}</Typography> }
    { enemy?.id && total > 0 && <Button variant="contained" color="primary" onClick={applyChasePoints}>Apply Chase Points</Button> }
    </>
  )
}
