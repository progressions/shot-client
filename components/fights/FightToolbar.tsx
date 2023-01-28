import { colors, Box, Paper, ButtonGroup, Switch, FormControlLabel, Stack } from '@mui/material'

import ButtonBar from "../ButtonBar"
import CreateCharacter from '../characters/CreateCharacter'
import SelectCharacter from '../characters/SelectCharacter'
import CreateVehicle from '../vehicles/CreateVehicle'
import DiceRoller from '../dice/DiceRoller'
import MookRolls from '../MookRolls'
import RollInitiative from "./RollInitiative"
import GamemasterOnly from "../GamemasterOnly"

import type { Fight } from "../../types/types"

import { useSession } from 'next-auth/react'
import { useFight } from "../../contexts/FightContext"
import { useLocalStorage } from "../../contexts/LocalStorageContext"

import { useEffect } from "react"

interface FightToolbarParams {
  showHidden: boolean,
  setShowHidden: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FightToolbar({ showHidden, setShowHidden }: FightToolbarParams) {
  const { fight, setFight } = useFight()
  const { saveLocally, getLocally } = useLocalStorage()

  const session: any = useSession({ required: true })

  useEffect(() => {
    const showHiddenShots = getLocally("showHiddenShots") || false
    setShowHidden(showHiddenShots)
  }, [])

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
          <GamemasterOnly user={session?.data?.user}>
            <RollInitiative />
          </GamemasterOnly>
          <DiceRoller />
          <ButtonGroup>
            <CreateVehicle fight={fight} setFight={setFight} />
            <CreateCharacter fight={fight} setFight={setFight} />
          </ButtonGroup>
          <ButtonGroup>
            <SelectCharacter />
          </ButtonGroup>
          <MookRolls />
          <GamemasterOnly user={session?.data?.user}>
            <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
          </GamemasterOnly>
        </Stack>
      </ButtonBar>
    </>
  )
}
