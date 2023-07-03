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

import type { Fight } from "../../types/types"

import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import { useLocalStorage } from "../../contexts/LocalStorageContext"

import { useEffect } from "react"

interface FightToolbarParams {
  showHidden: boolean,
  setShowHidden: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FightToolbar({ showHidden, setShowHidden }: FightToolbarParams) {
  const { fight } = useFight()
  const { saveLocally, getLocally } = useLocalStorage()
  const { user } = useClient()

  useEffect(() => {
    const showHiddenShots = getLocally("showHiddenShots") || true
    setShowHidden(!!showHiddenShots)
  }, [getLocally, setShowHidden])

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
            <SelectCharacter />
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
