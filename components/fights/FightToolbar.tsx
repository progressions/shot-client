import { colors, Box, Paper, ButtonGroup, Switch, FormControlLabel, Stack } from '@mui/material'

import { ButtonBar } from "@/components/StyledFields"
import CreateCharacter from '@/components/characters/CreateCharacter'
import SelectCharacter from '@/components/characters/SelectCharacter'
import CreateVehicle from '@/components/vehicles/CreateVehicle'
import DiceRoller from '@/components/dice/DiceRoller'
import GamemasterOnly from "@/components/GamemasterOnly"
import SelectParty from "@/components/parties/SelectParty"
import AttackButton from "@/components/attacks/AttackButton"

import type { Fight, Vehicle, Character } from "@/types/types"

import { useFight } from "@/contexts/FightContext"
import { useClient } from "@/contexts/ClientContext"
import { useLocalStorage } from "@/contexts/LocalStorageContext"
import { useToast } from "@/contexts/ToastContext"
import { FightActions } from "@/reducers/fightState"

import { useEffect } from "react"

interface FightToolbarParams {
  showHidden: boolean,
  setShowHidden: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FightToolbar({ showHidden, setShowHidden }: FightToolbarParams) {
  const { fight, dispatch } = useFight()
  const { saveLocally, getLocally } = useLocalStorage()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    const showHiddenShots = getLocally("showHiddenShots") || true
    setShowHidden(!!showHiddenShots)
  }, [getLocally, setShowHidden])

  const addCharacter = async (character: Character):Promise<void> => {
    try {
      (character.category === "character") ?
        await client.addCharacter(fight, character as Character)
      : await client.addVehicle(fight, character as Vehicle)

      toastSuccess(`${character.name} added.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    dispatch({ type: FightActions.EDIT })
  }

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    saveLocally("showHiddenShots", checked)
    setShowHidden(checked)
  }
  if (!fight?.id) {
    return <></>
  }
  return (
    <>
      <ButtonBar>
        <Stack direction="row" spacing={2} alignItems='center'>
          <DiceRoller />
          <ButtonGroup>
            <CreateVehicle />
            <CreateCharacter />
          </ButtonGroup>
          <ButtonGroup>
            <SelectCharacter addCharacter={addCharacter} />
          </ButtonGroup>
          <ButtonGroup>
            <SelectParty />
          </ButtonGroup>
          <AttackButton />
          <GamemasterOnly user={user}>
            <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
          </GamemasterOnly>
        </Stack>
      </ButtonBar>
    </>
  )
}
