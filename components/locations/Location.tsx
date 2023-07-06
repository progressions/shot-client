import AddLocationIcon from '@mui/icons-material/AddLocation'
import { Typography } from '@mui/material'
import type { Character } from "../../types/types"
import { useState, useEffect } from 'react'
import { useClient } from '../../contexts/ClientContext'
import { useFight } from '../../contexts/FightContext'
import { useToast } from '../../contexts/ToastContext'
import { FightActions } from "../../reducers/fightState"

interface LocationProps {
  shot: number
  character: Character
}

export default function Location({ shot, character }: LocationProps) {
  const { user, client } = useClient()
  const { fight, state, dispatch } = useFight()
  const { toastError } = useToast()
  const [location, setLocation] = useState<any>(null)

  useEffect(() => {
    const reload = async () => {
      try {
        const data = character?.category === "character" ?
          await client.getLocationForCharacter(fight, character) :
          await client.getLocationForVehicle(fight, character)
        if (data.length > 0) {
          setLocation(data[0])
        } else {
          setLocation(null)
        }
      } catch(error) {
        console.log(error)
        toastError()
      }
    }
    if (user && character?.id) {
      reload()
    }
  }, [user, character?.id, shot, state.edited])

  async function setLocationForShot() {
    try {
      const name = prompt("Location name")
      if (!name) {
        return
      }
      if (character?.category === "character") {
        await client.setCharacterLocation(fight, character, { name: name })
      } else {
        await client.setVehicleLocation(fight, character, { name: name })
      }
      dispatch({ type: FightActions.EDIT })
    } catch(error) {
      console.log(error)
      toastError()
    }
  }

  return (
    <Typography sx={{opacity: 0.5, display: "inline", ml: 1}} onClick={setLocationForShot}>
      { location?.name }
      <AddLocationIcon sx={{fontSize: "1em", ml: 0.5}} />
    </Typography>
  )
}
