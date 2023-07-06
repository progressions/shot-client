import AddLocationIcon from '@mui/icons-material/AddLocation'
import { Typography } from '@mui/material'
import type { Vehicle, Character } from "../../types/types"
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
          await client.getLocationForCharacter(fight, character as Character) :
          await client.getLocationForVehicle(fight, character as Vehicle)
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
  }, [user, client, fight, toastError, character, shot, state.edited])

  async function setLocationForShot() {
    try {
      const name = prompt("Location name")
      if (!name) {
        return
      }
      if (character?.category === "character") {
        await client.setCharacterLocation(fight, character as Character, { name: name })
      } else {
        await client.setVehicleLocation(fight, character as Vehicle, { name: name })
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
