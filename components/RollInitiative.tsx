import { Button } from "@mui/material"
import { useState } from "react"
import { useSession } from 'next-auth/react'

import type { ShotType, Fight, Toast, Character, Person, Vehicle } from "../types/types"

import { useFight } from "../contexts/FightContext"
import { useToast } from "../contexts/ToastContext"
import { loadFight } from './fights/FightDetail'
import { rollDie } from "./DiceRoller"
import Client from "./Client"

export default function RollInitiative() {
  const [fight, setFight] = useFight()
  const [processing, setProcessing] = useState<boolean>(false)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt: jwt })
  const { setToast } = useToast()

  const handleClick = async () => {
    setProcessing(true)
    const nonzeroShots = fight.shot_order.filter(([shot, characters]: ShotType) => {
      // only roll for characters on shots zero or below
      return (shot <= 0)
    })

    await Promise.all(nonzeroShots.map(rollForShot))

    await loadFight({jwt, id: fight.id as string, setFight})
    setToast({ open: true, message: "Initiative updated", severity: "success" })
    setProcessing(false)
  }

  const rollForShot = async ([shot, characters]: ShotType) => {
    const eligibleCharacters = characters.filter((character: Character) => {
      // only roll for GMCs with a Speed value
      return (character.action_values["Type"] !== "PC") && (character.action_values["Speed"] || character.action_values["Acceleration"])
    })

    await Promise.all(
      eligibleCharacters.map(async (character: Character) => {
        if (character.category === "character") {
          await updateCharacter(character as Person, shot)
        } else {
          await updateVehicle(character as Vehicle, shot)
        }
      })
    )
  }

  const updateCharacter = async (character: Person, shot: number) => {
    const roll = (character.action_values["Speed"] as number) - (character.impairments || 0) + rollDie() + shot
    const initiative = (roll > 1) ? roll : 1
    const response = await client.updateCharacter({...character, "current_shot": initiative}, fight)
    return (response.status === 200)
  }

  const updateVehicle = async (vehicle: Vehicle, shot: number) => {
    const roll = (vehicle.action_values["Acceleration"] as number) - (vehicle.impairments || 0) + rollDie() + shot
    const initiative = (roll > 1) ? roll : 1
    const response = await client.updateVehicle({...vehicle, "current_shot": initiative}, fight)
    return (response.status === 200)
  }

  return (
    <Button variant="contained" color="secondary" disabled={processing} onClick={handleClick}>Initiative</Button>
  )
}
