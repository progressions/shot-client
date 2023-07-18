import React from "react"
import { Button, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { FightActions } from "../../reducers/fightState"
import type { Character, ActionValues } from "../../types/types"
import type { MookRollValue } from "../MookRolls"
import CS from "../../services/CharacterService"
import AS, { AttackRollType } from "../../services/ActionService"

interface SmackdownsParams {
  enemy: Character
  attackRolls: AttackRollType[]
  value: MookRollValue
  handleClose: () => void
}

export default function Smackdowns({ enemy, attackRolls, value, handleClose }: SmackdownsParams) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { fight, dispatch } = useFight()

  const damageMessage = (enemy: Character, attackRoll: AttackRollType) => {
    const originalToughness = CS.rawActionValue(enemy, "Toughness")
    const toughness = CS.toughness(enemy)
    const outcome = attackRoll.outcome
    const smackdown = attackRoll.smackdown
    const wounds = attackRoll.wounds
    const toughnessDisplay = (toughness < originalToughness) ? (<><strong style={{color: "red"}}>{toughness}</strong> ({enemy.action_values["Toughness"]})</>) : toughness
    const toughnessMessage = (toughness) ? (<> - Toughness {toughnessDisplay} = <strong style={{color: "red"}}>{wounds} Wounds</strong></>) : ""

    return (<>{attackRoll.actionResult}: Smackdown of {smackdown} {toughnessMessage}</>)
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

  const successfulRolls = attackRolls.filter((attackRoll: AttackRollType) => attackRoll.success)
  const total = AS.totalWounds({ attackRolls: successfulRolls, toughness: CS.toughness(enemy) })

  return (<>
    { successfulRolls.length > 0 && enemy.name && <Typography variant="h5" py={2}>{enemy.name}</Typography> }
    {
      successfulRolls
      .map((attackRoll: AttackRollType, index: number) => {
        const message = damageMessage(enemy, attackRoll)
        return (<React.Fragment key={(Math.random() * 10000)}><Typography component="span">{message}</Typography><br /></React.Fragment>)
      })
    }
    { enemy?.id && total > 0 && <Typography variant="h5" py={2} sx={{color: "red"}}>Total Wounds: {total}</Typography> }
    { enemy?.id && total > 0 && <Button variant="contained" color="primary" onClick={applyWounds}>Apply Wounds</Button> }
    </>
  )
}
