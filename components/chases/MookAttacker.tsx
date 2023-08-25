import { Stack, Button, FormControlLabel, Switch } from "@mui/material"
import { StyledTextField } from "@/components/StyledFields"
import type { ChaseState } from "@/reducers/chaseState"
import type { Vehicle, Character } from "@/types/types"
import VS from "@/services/VehicleService"
import CS from "@/services/CharacterService"
import { useFight } from "@/contexts/FightContext"

interface MookAttacksProps {
  state: ChaseState
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleCheck: (event: React.SyntheticEvent<Element, Event>, checked: boolean) => void
}

export default function MookAttacks({ state, handleChange, handleCheck }: MookAttacksProps) {
  const { count, stunt, attacker, actionValue, squeal, crunch, edited, fight } = state

  return(<>
    <Stack direction="row" spacing={2} alignItems="top">
      <StyledTextField
        name="count"
        value={count}
        onChange={handleChange}
        label="Count"
        type="number"
        sx={{width: 110}}
        disabled={edited}
      />
      <StyledTextField
        name="actionValue"
        value={actionValue}
        onChange={handleChange}
        label="Driving"
        type="number"
        sx={{width: 110}}
        disabled={edited}
      />
      <StyledTextField disabled={edited} name="squeal" value={squeal} onChange={handleChange} label="Squeal" type="number" sx={{width: 80}} />
      <StyledTextField disabled={edited} name="crunch" value={crunch} onChange={handleChange} label="Crunch" type="number" sx={{width: 80}} />
      <FormControlLabel disabled={edited} label="Stunt" name="stunt" control={<Switch checked={stunt} />} onChange={handleCheck} />
    </Stack>
  </>)
}

