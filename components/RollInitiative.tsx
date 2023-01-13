import { Button } from "@mui/material"
import { useState } from "react"
import { useSession } from 'next-auth/react'

import type { ShotType, Fight, Toast, Character, Person, Vehicle } from "../types/types"

import { loadFight } from './FightDetail'
import { rollDie } from "./DiceRoller"
import Client from "./Client"

interface RollInitiativeProps {
  fight: Fight
  setFight: React.Dispatch<React.SetStateAction<Fight>>
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function RollInitiative({ fight, setFight, setToast }) {
  const [processing, setProcessing] = useState<boolean>(false)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt: jwt })

  const handleClick = async () => {
    setProcessing(true)
    console.log("Rolling")
    fight.shot_order.filter(([shot, characters]: ShotType) => {
      // only roll for characters on shots zero or below
      return (shot <= 0)
    }).forEach(([shot, characters]: ShotType) => {
      console.log("Shot", shot)
      characters.filter((character: Character) => {
        // only roll for GMCs with a Speed value
        return (character.action_values["Type"] !== "PC" && character.action_values["Speed"])
      }).forEach(async (character: Character) => {
        const initiative = parseInt(character.action_values["Speed"]) + rollDie() + shot
        const response = await client.updateCharacter({...character, "current_shot": initiative}, fight)
        if (response.status === 200) {
          await loadFight({jwt, id: fight.id as string, setFight})
          setToast({ open: true, message: "Initiative updated", severity: "success" })
        }
      })
    })
    setProcessing(false)
  }

  return (
    <Button variant="contained" color="secondary" disabled={processing} onClick={handleClick}>Initiative</Button>
  )
}

/*
      characters.forEach((character: Character) => {
        console.log("Speed", character.action_values["Speed"])
      })
      */
