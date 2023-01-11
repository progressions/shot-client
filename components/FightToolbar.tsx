import { Switch, FormControlLabel, Stack } from '@mui/material'

import CreateCharacter from './character/CreateCharacter'
import SelectCharacter from './SelectCharacter'
import CreateVehicle from './vehicles/CreateVehicle'
import DiceRoller from './DiceRoller'
import MookRolls from './MookRolls'

import type { Fight, Toast } from "../types/types"

interface FightToolbarParams {
  fight: Fight,
  setFight: React.Dispatch<React.SetStateAction<Fight>>
  showHidden: boolean,
  setShowHidden: React.Dispatch<React.SetStateAction<boolean>>
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function FightToolbar({ fight, setFight, showHidden, setShowHidden, setToast }: FightToolbarParams) {
  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setShowHidden(checked)
  }
  return (
    <>
      <Stack direction="row" spacing={2} alignItems='center'>
        <DiceRoller />
        <CreateVehicle fight={fight} setFight={setFight} setToast={setToast} />
        <CreateCharacter fight={fight} setFight={setFight} setToast={setToast} />
        <SelectCharacter fight={fight} setFight={setFight} />
        <MookRolls />
        <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
      </Stack>
    </>
  )
}
