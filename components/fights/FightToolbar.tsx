import { ButtonGroup, Switch, FormControlLabel, Stack } from '@mui/material'

import CreateCharacter from '../character/CreateCharacter'
import SelectCharacter from '../character/SelectCharacter'
import SelectVehicle from '../vehicles/SelectVehicle'
import CreateVehicle from '../vehicles/CreateVehicle'
import DiceRoller from '../DiceRoller'
import MookRolls from '../MookRolls'
import RollInitiative from "../RollInitiative"

import { useCurrentFight } from "../../contexts/CurrentFight"

import type { Fight, Toast } from "../../types/types"

interface FightToolbarParams {
  showHidden: boolean,
  setShowHidden: React.Dispatch<React.SetStateAction<boolean>>
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function FightToolbar({ showHidden, setShowHidden, setToast }: FightToolbarParams) {
  const [fight, setFight] = useCurrentFight()
  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setShowHidden(checked)
  }
  return (
    <>
      <Stack direction="row" spacing={2} alignItems='center'>
        <RollInitiative fight={fight} setFight={setFight} setToast={setToast} />
        <DiceRoller />
        <ButtonGroup>
          <CreateVehicle fight={fight} setFight={setFight} setToast={setToast} />
          <SelectVehicle fight={fight} setFight={setFight} />
        </ButtonGroup>
        <ButtonGroup>
          <CreateCharacter fight={fight} setFight={setFight} setToast={setToast} />
          <SelectCharacter fight={fight} setFight={setFight} />
        </ButtonGroup>
        <MookRolls />
        <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
      </Stack>
    </>
  )
}
