import { Switch, FormControlLabel, Stack } from '@mui/material'

import NewCharacter from './character/NewCharacter'
import SelectCharacter from './SelectCharacter'
import DiceRoller from './DiceRoller'
import MookRolls from './MookRolls'

const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function FightToolbar({ fight, setFight, showHidden, setShowHidden }: any) {
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
