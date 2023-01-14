import { ButtonGroup, Switch, FormControlLabel, Stack } from '@mui/material'

import CreateCharacter from '../character/CreateCharacter'
import SelectCharacter from '../character/SelectCharacter'
import SelectVehicle from '../vehicles/SelectVehicle'
import CreateVehicle from '../vehicles/CreateVehicle'
import DiceRoller from '../DiceRoller'
import MookRolls from '../MookRolls'
import RollInitiative from "../RollInitiative"

import type { Fight } from "../../types/types"

interface FightToolbarParams {
  fight: Fight,
  setFight: React.Dispatch<React.SetStateAction<Fight>>
  showHidden: boolean,
  setShowHidden: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FightToolbar({ fight, setFight, showHidden, setShowHidden }: FightToolbarParams) {
  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setShowHidden(checked)
  }
  return (
    <>
      <Stack direction="row" spacing={2} alignItems='center'>
        <RollInitiative fight={fight} setFight={setFight} />
        <DiceRoller />
        <ButtonGroup>
          <CreateVehicle fight={fight} setFight={setFight} />
          <SelectVehicle fight={fight} setFight={setFight} />
        </ButtonGroup>
        <ButtonGroup>
          <CreateCharacter fight={fight} setFight={setFight} />
          <SelectCharacter fight={fight} setFight={setFight} />
        </ButtonGroup>
        <MookRolls />
        <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
      </Stack>
    </>
  )
}
