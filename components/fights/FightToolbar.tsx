import { ButtonGroup, Switch, FormControlLabel, Stack } from '@mui/material'

import CreateCharacter from '../character/CreateCharacter'
import SelectCharacter from '../character/SelectCharacter'
import SelectVehicle from '../vehicles/SelectVehicle'
import CreateVehicle from '../vehicles/CreateVehicle'
import DiceRoller from '../DiceRoller'
import MookRolls from '../MookRolls'
import RollInitiative from "../RollInitiative"

import type { Fight } from "../../types/types"

import { useFight } from "../../contexts/FightContext"

interface FightToolbarParams {
  showHidden: boolean,
  setShowHidden: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FightToolbar({ showHidden, setShowHidden }: FightToolbarParams) {
  const [fight, setFight] = useFight()

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setShowHidden(checked)
  }
  return (
    <>
      <Stack direction="row" spacing={2} alignItems='center'>
        <RollInitiative />
        <DiceRoller />
        <ButtonGroup>
          <CreateVehicle fight={fight} setFight={setFight} />
          <SelectVehicle />
        </ButtonGroup>
        <ButtonGroup>
          <CreateCharacter fight={fight} setFight={setFight} />
          <SelectCharacter />
        </ButtonGroup>
        <MookRolls />
        <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
      </Stack>
    </>
  )
}
