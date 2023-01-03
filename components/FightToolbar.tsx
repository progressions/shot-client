import { Switch, FormControlLabel, Stack } from '@mui/material'

import AddCharacter from './character/AddCharacter'
import DiceRoller from './DiceRoller'
import MookRolls from './MookRolls'

export default function FightToolbar({ fight, setFight, endpoint, showHidden, setShowHidden }: any) {
  return (
    <>
      <Stack direction="row" spacing={2} alignItems='center'>
        <DiceRoller />
        <AddCharacter fight={fight} endpoint={endpoint} setFight={setFight} />
        <MookRolls />
        <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={(event) => setShowHidden(event.target.checked)} />
      </Stack>
    </>
  )
}
