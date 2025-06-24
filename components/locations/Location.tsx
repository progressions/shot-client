import AddLocationIcon from '@mui/icons-material/AddLocation'
import { Typography } from '@mui/material'
import type { Vehicle, Character } from "@/types/types"
import { useState, useEffect } from 'react'
import { useClient } from '@/contexts/ClientContext'
import { useFight } from '@/contexts/FightContext'
import { useToast } from '@/contexts/ToastContext'
import { FightActions } from "@/reducers/fightState"
import GamemasterOnly from "@/components/GamemasterOnly"
import CS from "@/services/CharacterService"

interface LocationProps {
  shot: number
  character: Character
}

export default function Location({ shot, character }: LocationProps) {
  const { user, client } = useClient()
  const { fight, state, dispatch } = useFight()
  const { toastError } = useToast()
  const [loading, setLoading] = useState(false)

  async function setLocationForShot() {
    setLoading(true)
    try {
      const name = prompt("Location name")
      if (name === null) {
        return
      }
      if (CS.isCharacter(character)) {
        await client.setCharacterLocation(character as Character, { name: name })
      } else {
        await client.setVehicleLocation(character as Vehicle, { name: name })
      }
      await client.touchFight(fight)
      dispatch({ type: FightActions.EDIT })
    } catch(error) {
      console.error(error)
      toastError()
    }
    setLoading(false)
  }

  return (
    <Typography sx={{opacity: 0.5, display: "inline", ml: 1}} onClick={setLocationForShot}>
      { loading && "Loading..." }
      { !loading && character.location }
      { !loading && (<GamemasterOnly user={user}>
        <AddLocationIcon sx={{fontSize: "1em", ml: 0.5}} />
      </GamemasterOnly>) }
    </Typography>
  )
}
