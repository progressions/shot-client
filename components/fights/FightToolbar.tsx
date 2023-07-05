import { colors, Box, Paper, ButtonGroup, Switch, FormControlLabel, Stack } from '@mui/material'

import { ButtonBar } from "../StyledFields"
import CreateCharacter from '../characters/CreateCharacter'
import SelectCharacter from '../characters/SelectCharacter'
import CreateVehicle from '../vehicles/CreateVehicle'
import DiceRoller from '../dice/DiceRoller'
import MookRolls from '../MookRolls'
import RollInitiative from "./RollInitiative"
import GamemasterOnly from "../GamemasterOnly"
import SelectParty from "../parties/SelectParty"

import type { Fight, Vehicle, Character } from "../../types/types"

import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import { useLocalStorage } from "../../contexts/LocalStorageContext"
import { useToast } from "../../contexts/ToastContext"
import { FightActions } from "../../reducers/fightState"

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
      console.log(error)
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
          <GamemasterOnly user={user}>
            <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
          </GamemasterOnly>
        </Stack>
      </ButtonBar>
    </>
  )
}
