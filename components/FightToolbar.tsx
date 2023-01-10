import { Switch, FormControlLabel, Stack } from '@mui/material'

import CreateCharacter from './character/CreateCharacter'
import SelectCharacter from './SelectCharacter'
import DiceRoller from './DiceRoller'
import MookRolls from './MookRolls'

import type { Fight } from "../types/types"

interface FightToolbarParams {
  fight: Fight,
  setFight: (fight: Fight) => void,
  showHidden: boolean,
  setShowHidden: (hidden: boolean) => void
}

export default function FightToolbar({ fight, setFight, showHidden, setShowHidden }: FightToolbarParams) {
  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setShowHidden(checked)
  }
  return (
    <>
      <Stack direction="row" spacing={2} alignItems='center'>
        <DiceRoller />
        <CreateCharacter fight={fight} setFight={setFight} />
        <SelectCharacter fight={fight} setFight={setFight} />
        <MookRolls />
        <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
      </Stack>
    </>
  )
}
