import { Stack } from '@mui/material'

import AddCharacter from './character/AddCharacter'
import DiceRoller from './DiceRoller'
import MookRolls from './MookRolls'

export default function FightToolbar({ fight, setFight, endpoint }: any) {
  return (
    <>
      <Stack direction="row" spacing={2} alignItems='center'>
        <DiceRoller />
        <AddCharacter fight={fight} endpoint={endpoint} setFight={setFight} />
        <MookRolls />
      </Stack>
    </>
  )
}
