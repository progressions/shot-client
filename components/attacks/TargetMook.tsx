import { Stack } from "@mui/material"
import { StyledTextField } from "../StyledFields"
import type { AttackState } from "../../reducers/attackState"
import type { Character } from "../../types/types"

interface TargetMookProps {
  state: AttackState
  setTarget: (character: Character) => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function TargetMook({ state, setTarget, handleChange }: TargetMookProps) {
  const { count, attacker, target, defense, toughness, edited } = state

  return(<>
    <Stack direction="row" spacing={2} alignItems="top">
      <StyledTextField disabled={edited}
        name="defense"
        value={defense}
        onChange={handleChange}
        label="Defense"
        type="number"
        sx={{width: 110}}
      />
      <StyledTextField disabled={edited}
        name="count"
        value={count}
        onChange={handleChange}
        label="Count"
        type="number"
        sx={{width: 110}}
      />
    </Stack>
  </>)
}
