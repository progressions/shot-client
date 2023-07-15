import React from "react"
import { Button, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { FightActions } from "../../reducers/fightState"
import type { Character, ActionValues } from "../../types/types"
import type { MookRollValue } from "../MookRolls"

interface SmackdownsParams {
  enemy: Character
  rolls: number[]
  value: MookRollValue
  handleClose: () => void
}

export default function Smackdowns({ enemy, rolls, value, handleClose }: SmackdownsParams) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { fight, dispatch } = useFight()

  const actualToughness = (enemy: Character): number => {
    if (enemy.action_values["Toughness"]) {
      const impairments = enemy.impairments || 0
      const toughness = enemy.action_values["Toughness"] || 0
      const modifiedToughness = toughness as number - impairments as number
      return Math.max(0, modifiedToughness)
    } else {
      return 0
    }
  }

  const damageMessage = (enemy: Character, outcome: number) => {
    const originalToughness = enemy.action_values["Toughness"] || 0
    const toughness = actualToughness(enemy)
    const smackdown = outcome - value.defense + value.damage
    const wounds = Math.max(0, smackdown - toughness)
    const toughnessDisplay = (toughness < originalToughness) ? (<><strong style={{color: "red"}}>{toughness}</strong> ({enemy.action_values["Toughness"]})</>) : toughness
    const toughnessMessage = (toughness) ? (<> - Toughness {toughnessDisplay} = <strong style={{color: "red"}}>{wounds} Wounds</strong></>) : ""

    return [(<>{outcome}: Smackdown of {smackdown} {toughnessMessage}</>), wounds as number]
  }

  const damage = (enemy: Character, outcome: number): number => {
    const originalToughness = enemy.action_values["Toughness"] || 0
    const toughness = actualToughness(enemy)
    const smackdown = outcome - value.defense + value.damage
    const wounds:number = Math.max(0, smackdown - toughness) as number

    return wounds
  }

  const applyWounds = async () => {
    const originalWounds = parseInt(enemy.action_values["Wounds"] as string) || 0
    const newWounds = originalWounds + total
    const actionValues = enemy.action_values as ActionValues
    actionValues['Wounds'] = newWounds

    try {
      await client.updateCharacter({ ...enemy, "action_values": actionValues}, fight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`${enemy.name} took ${total} wounds.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  const successfulRolls = rolls.filter((roll: number) => (roll >= value.defense))
  const total:number = successfulRolls.reduce((total: number, outcome: number) => {
    const wounds:number = damage(enemy, outcome) as number
    return total + wounds
  }, 0)

  return (<>
    { rolls.length > 0 && enemy.name && <Typography variant="h5" py={2}>{enemy.name}</Typography> }
    {
      successfulRolls
        .map((outcome: number, index: number) => {
          const [message, wounds] = damageMessage(enemy, outcome)
          return (<React.Fragment key={(Math.random() * 10000)}><Typography component="span">{message}</Typography><br /></React.Fragment>)
        })
      }
      { enemy?.id && total > 0 && <Typography variant="h5" py={2} sx={{color: "red"}}>Total Wounds: {total}</Typography> }
      { enemy?.id && total > 0 && <Button variant="contained" color="primary" onClick={applyWounds}>Apply Wounds</Button> }
    </>
  )
}
