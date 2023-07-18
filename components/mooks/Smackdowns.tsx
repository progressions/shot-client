import React from "react"
import { Button, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { FightActions } from "../../reducers/fightState"
import type { Character, ActionValues } from "../../types/types"
import type { MookRollValue } from "../MookRolls"
import CS from "../../services/CharacterService"

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

  const damage = (enemy: Character, outcome: number): number => {
    const smackdown = outcome - value.defense + value.damage
    return CS.calculateWounds(enemy, smackdown)
  }
  const damageMessage = (enemy: Character, outcome: number) => {
    const originalToughness = CS.rawActionValue(enemy, "Toughness")
    const toughness = CS.toughness(enemy)
    const smackdown = outcome - value.defense + value.damage
    const wounds = damage(enemy, outcome)
    const toughnessDisplay = (toughness < originalToughness) ? (<><strong style={{color: "red"}}>{toughness}</strong> ({enemy.action_values["Toughness"]})</>) : toughness
    const toughnessMessage = (toughness) ? (<> - Toughness {toughnessDisplay} = <strong style={{color: "red"}}>{wounds} Wounds</strong></>) : ""

    return [(<>{outcome}: Smackdown of {smackdown} {toughnessMessage}</>), wounds as number]
  }

  const applyWounds = async () => {
    const updatedEnemy = CS.takeRawWounds(enemy, total)

    try {
      await client.updateCharacter(updatedEnemy, fight)
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
    const wounds = damage(enemy, outcome)
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
