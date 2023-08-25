import { MenuItem, Stack } from "@mui/material"
import { ChaseMethod } from "@/reducers/chaseState"
import { StyledSelect, StyledTextField } from "@/components/StyledFields"
import type { Vehicle } from "@/types/types"
import type { ChaseState } from "@/reducers/chaseState"
import VS from "@/services/VehicleService"

interface TargetMookProps {
  state: ChaseState
  setTarget: (character: Vehicle) => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function TargetMook({ state, setTarget, handleChange }: TargetMookProps) {
  const { method, count, attacker, target, defense, edited } = state

  return(<>
    <Stack direction="row" spacing={2} alignItems="top">
      <StyledTextField disabled={edited}
        name="defense"
        value={defense}
        onChange={handleChange}
        label="Driving"
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
      <StyledSelect select disabled={edited} name="method" value={method} onChange={handleChange} label={ VS.isPursuer(attacker) ? "Pursue" : "Evade" } sx={{width: 170}}>
        { VS.isNear(attacker) && <MenuItem key={ChaseMethod.RAM_SIDESWIPE} value={ChaseMethod.RAM_SIDESWIPE}>{ChaseMethod.RAM_SIDESWIPE}</MenuItem> }
        { VS.isPursuer(attacker) && VS.isFar(attacker) && <MenuItem key={ChaseMethod.NARROW_THE_GAP} value={ChaseMethod.NARROW_THE_GAP}>{ChaseMethod.NARROW_THE_GAP}</MenuItem> }
        { VS.isEvader(attacker) && VS.isNear(attacker) && <MenuItem key={ChaseMethod.WIDEN_THE_GAP} value={ChaseMethod.WIDEN_THE_GAP}>{ChaseMethod.WIDEN_THE_GAP}</MenuItem> }
        { VS.isEvader(attacker) && VS.isFar(attacker) && <MenuItem key={ChaseMethod.EVADE} value={ChaseMethod.EVADE}>{ChaseMethod.EVADE}</MenuItem> }
      </StyledSelect>
    </Stack>
  </>)
}

