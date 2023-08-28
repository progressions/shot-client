import { Stack, Button, FormControlLabel, Switch } from "@mui/material"
import { StyledTextField } from "@/components/StyledFields"
import type { ChaseState } from "@/reducers/chaseState"
import type { Character, Weapon } from "@/types/types"
import VS from "@/services/VehicleService"
import MookAttacker from "@/components/chases/MookAttacker"

interface AttackerProps {
  state: ChaseState
  setAttacker: (character: Character) => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleCheck: (event: React.SyntheticEvent<Element, Event>, checked: boolean) => void
}

export default function Attacker({ state, setAttacker, handleChange, handleCheck }: AttackerProps) {
  const { crunch, frame, stunt, attacker, actionValue, squeal, edited, fight } = state

  if (VS.isMook(attacker)) return (
    <MookAttacker
      state={state}
      handleChange={handleChange}
      handleCheck={handleCheck}
    />
  )

  return(<>
    <Stack direction="row" spacing={2} alignItems="top">
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
