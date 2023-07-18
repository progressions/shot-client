import { Button } from "@mui/material"
import { useMemo, useEffect, useState } from "react"
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import type { ShotType, Fight, Toast, Character, Person, Vehicle } from "../../types/types"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { rollDie } from "../dice/DiceRoller"
import Client from "../../utils/Client"
import { FightActions } from "../../reducers/fightState"
import CS from "../../services/CharacterService"

export default function RollInitiative() {
  const { fight, dispatch:dispatchFight } = useFight()
  const [processing, setProcessing] = useState<boolean>(false)

  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const startOfSequence = useMemo(() => ((fight?.shot_order?.[0]?.[0] || 0) === 0), [fight.shot_order])

  const addSequence = async () => {
    try {
      await client.updateFight({ id: fight.id, sequence: fight.sequence + 1 } as Fight)
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`Sequence increased.`)
    } catch(error) {
      dispatchFight({ type: FightActions.ERROR, payload: error as Error })
      console.error(error)
      toastError()
    }
  }

  const handleClick = async () => {
    setProcessing(true)
    const nonzeroShots = fight.shot_order.filter(([shot, characters]: ShotType) => {
      if (shot === null || shot === undefined) {
        return false
      }
      // only roll for characters on shots zero or below
      return (shot <= 0)
    })

    if (startOfSequence) {
      await addSequence()
    }

    await Promise.all(nonzeroShots.map(rollForShot))

    dispatchFight({ type: FightActions.EDIT })
    toastSuccess("Initiative updated")
    setProcessing(false)
  }

  const rollForShot = async ([shot, characters]: ShotType) => {
    const eligibleCharacters = characters.filter((character: Character) => {
      // only roll for GMCs with a Speed value
      return (!CS.isType(character, "PC")) && (CS.actionValue(character, "Speed") || CS.actionValue(character, "Acceleration"))
    })

    await Promise.all(
      eligibleCharacters.map(async (character: Character) => {
        if (CS.isCharacter(character)) {
          await updateCharacter(character as Person, shot)
        } else {
          await updateVehicle(character as Vehicle, shot)
        }
      })
    )
  }

  const updateCharacter = async (character: Person, shot: number) => {
    const roll = CS.actionValue(character, "Speed") + rollDie() + shot
    const initiative = (roll > 1) ? roll : 1
    const updatedCharacter = CS.updateValue(character, "current_shot", initiative)
    try {
      const data = await client.updateCharacter(updatedCharacter, fight)
      return !!data
    } catch(error) {
      return false
    }
  }

  const updateVehicle = async (vehicle: Vehicle, shot: number) => {
    const roll = (vehicle.action_values["Acceleration"] as number) - (vehicle.impairments || 0) + rollDie() + shot
    const initiative = (roll > 1) ? roll : 1
    try {
      const data = await client.updateVehicle({...vehicle, "current_shot": initiative}, fight)
      return !!data
    } catch(error) {
      return false
    }
  }

  function label() {
    if (startOfSequence) {
      return ("Start")
    } else {
      return ("Initiative")
    }
  }

  return (
    <Button variant="contained" color="secondary" endIcon={<PlayArrowIcon />} disabled={processing} onClick={handleClick}>{label()}</Button>
  )
}
