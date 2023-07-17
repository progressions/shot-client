import React from "react"
import { Button, Typography } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useFight } from "../../../contexts/FightContext"
import { useToast } from "../../../contexts/ToastContext"
import { FightActions } from "../../../reducers/fightState"
import type { Vehicle, VehicleActionValues } from "../../../types/types"
import type { MookRollValue } from "./MookRolls"

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

  const actualHandling = (enemy: Vehicle): number => {
    if (enemy.action_values["Handling"]) {
      const impairments = enemy.impairments || 0
      const toughness = enemy.action_values["Handling"] || 0
      const modifiedHandling = toughness as number - impairments as number
      return Math.max(0, modifiedHandling)
    } else {
      return 0
    }
  }

  const damageMessage = (enemy: Vehicle, outcome: number) => {
    const originalHandling = enemy.action_values["Handling"] || 0
    console.log({ originalHandling })
    const toughness = actualHandling(enemy)
    console.log({ toughness })
    const smackdown = outcome - value.defense + value.damage
    console.log({ smackdown })
    const chasePoints = Math.max(0, smackdown - toughness)
    console.log({ chasePoints })
    const toughnessDisplay = (toughness < originalHandling) ? (<><strong style={{color: "red"}}>{toughness}</strong> ({enemy.action_values["Handling"]})</>) : toughness
    const toughnessMessage = (toughness) ? (<> - Handling {toughnessDisplay} = <strong style={{color: "red"}}>{chasePoints} Chase Points</strong></>) : ""

    return [(<>{outcome}: Smackdown of {smackdown} {toughnessMessage}</>), chasePoints as number]
  }

  const damage = (enemy: Vehicle, outcome: number): number => {
    const originalHandling = enemy.action_values["Handling"] || 0
    const toughness = actualHandling(enemy)
    const smackdown = outcome - value.defense + value.damage
    const chasePoints:number = Math.max(0, smackdown - toughness) as number

    return chasePoints
  }

  const applyChasePoints = async () => {
    const originalChasePoints = enemy.action_values["Chase Points"] || 0
    const newChasePoints = originalChasePoints + total
    const actionValues = enemy.action_values as VehicleActionValues
    actionValues['Chase Points'] = newChasePoints

    try {
      await client.updateVehicle({ ...enemy, "action_values": actionValues}, fight)
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
    const chasePoints:number = damage(enemy, outcome) as number
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
