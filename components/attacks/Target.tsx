import { Stack } from "@mui/material"
import { StyledTextField } from "@/components/StyledFields"
import type { AttackState } from "@/reducers/attackState"
import type { Character } from "@/types/types"
import CS from "@/services/CharacterService"
import TargetMook from "@/components/attacks/TargetMook"

interface TargetProps {
  state: AttackState
  setTarget: (character: Character) => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Target({ state, setTarget, handleChange }: TargetProps) {
  const { attacker, target, defense, toughness, edited } = state

  if (CS.isMook(target)) return (
    <TargetMook
      state={state}
      setTarget={setTarget}
      handleChange={handleChange}
    />
  )

  return(<>
    <Stack direction="row" spacing={2} alignItems="top">
      <StyledTextField disabled={edited} name="defense" value={defense} onChange={handleChange} label="Defense" type="number" sx={{width: 110}} />
      <StyledTextField disabled={edited} name="toughness" value={toughness} onChange={handleChange} label="Toughness" type="number" sx={{width: 110}} />
    </Stack>
  </>)
}
