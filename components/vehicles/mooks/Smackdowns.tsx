import React from "react"
import { Button, Typography } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useFight } from "../../../contexts/FightContext"
import { useToast } from "../../../contexts/ToastContext"
import { FightActions } from "../../../reducers/fightState"
import type { Vehicle, VehicleActionValues } from "../../../types/types"
import type { MookRollValue } from "./MookRolls"
import VS from "../../../services/VehicleService"

interface SmackdownsParams {
  enemy: Vehicle
  rolls: number[]
  value: MookRollValue
  handleClose: () => void
}

export default function Smackdowns({ enemy, rolls, value, handleClose }: SmackdownsParams) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { fight, dispatch } = useFight()

  const damage = (enemy: Vehicle, outcome: number): number => {
    const smackdown = outcome - value.defense + value.damage
    return VS.calculateChasePoints(enemy, smackdown)
  }

  const damageMessage = (enemy: Vehicle, outcome: number) => {
    const originalHandling = VS.rawActionValue(enemy, "Handling")
    const toughness = VS.handling(enemy)
    const smackdown = outcome - value.defense + value.damage

    const chasePoints = damage(enemy, outcome)

    const toughnessDisplay = (toughness < originalHandling) ? (<><strong style={{color: "red"}}>{toughness}</strong> ({originalHandling})</>) : toughness
    const toughnessMessage = (toughness) ? (<> - Handling {toughnessDisplay} = <strong style={{color: "red"}}>{chasePoints} Chase Points</strong></>) : ""

    return [(<>{outcome}: Smackdown of {smackdown} {toughnessMessage}</>), chasePoints as number]
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

  const successfulRolls = rolls.filter((roll: number) => (roll >= value.defense))
  const total:number = successfulRolls.reduce((total: number, outcome: number) => {
    const chasePoints = damage(enemy, outcome)
    return total + chasePoints
  }, 0)

  return (<>
    { rolls.length > 0 && enemy.name && <Typography variant="h5" py={2}>{enemy.name}</Typography> }
    {
      successfulRolls
        .map((outcome: number, index: number) => {
          const [message, chasePoints] = damageMessage(enemy, outcome)
          return (<React.Fragment key={(Math.random() * 10000)}><Typography component="span">{message}</Typography><br /></React.Fragment>)
        })
      }
      { enemy?.id && total > 0 && <Typography variant="h5" py={2} sx={{color: "red"}}>Total Chase Points: {total}</Typography> }
      { enemy?.id && total > 0 && <Button variant="contained" color="primary" onClick={applyChasePoints}>Apply Chase Points</Button> }
    </>
  )
}
