import { Switch, FormControlLabel, Stack } from '@mui/material'

import NewCharacter from './character/NewCharacter'
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
  return (
    <>
      <Stack direction="row" spacing={2} alignItems='center'>
        <DiceRoller />
        <NewCharacter fight={fight} setFight={setFight} />
        <SelectCharacter fight={fight} setFight={setFight} />
        <MookRolls />
        <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={(event: any) => setShowHidden(event.target.checked)} />
      </Stack>
    </>
  )
}
