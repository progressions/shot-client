import { Switch, FormControlLabel, Stack } from '@mui/material'

import NewCharacter from './character/NewCharacter'
import DiceRoller from './DiceRoller'
import MookRolls from './MookRolls'

export default function FightToolbar({ fight, setFight, endpoint, showHidden, setShowHidden }: any) {
  return (
    <>
      <Stack direction="row" spacing={2} alignItems='center'>
        <DiceRoller />
        <NewCharacter fight={fight} endpoint={endpoint} setFight={setFight} />
        <MookRolls />
        <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={(event: any) => setShowHidden(event.target.checked)} />
      </Stack>
    </>
  )
}
