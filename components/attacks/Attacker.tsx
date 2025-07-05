import { Stack, Button, FormControlLabel, Switch } from "@mui/material"
import { StyledTextField } from "@/components/StyledFields"
import type { AttackState } from "@/reducers/attackState"
import type { Character, Weapon } from "@/types/types"
import CS from "@/services/CharacterService"
import CES from "@/services/CharacterEffectService"
import MookAttacker from "@/components/attacks/MookAttacker"
import WeaponAutocomplete from "@/components/attacks/WeaponAutocomplete"

interface AttackerProps {
  state: AttackState
  setAttacker: (character: Character) => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  setWeapon: (weapon: Weapon) => void
  setAttack: (valueName: string) => void
  handleCheck: (event: React.SyntheticEvent<Element, Event>, checked: boolean) => void
}

export default function Attacker({ state, setAttacker, handleChange, setWeapon, setAttack, handleCheck }: AttackerProps) {
  const { stunt, attacker, weapon, actionValueName, actionValue, damage, edited, fight } = state

  if (CS.isMook(attacker)) return (
    <MookAttacker
      state={state}
      handleChange={handleChange}
      handleCheck={handleCheck}
      setWeapon={setWeapon}
      setAttack={setAttack}
    />
  )

  const [damageChanged, adjustedDamage] = CES.adjustedActionValue(attacker, "Damage", fight, true)
  const damageHelperText = damageChanged ? `${damageChanged > 0 ? "+" : ""}${damageChanged}` : ""

  const [actionValueChanged, adjustedActionValue] = CES.adjustedActionValue(attacker, actionValueName || CS.mainAttack(attacker), fight, false)
  const actionValueHelperText = actionValueChanged ? `${actionValueChanged > 0 ? "+" : ""}${actionValueChanged}` : ""

  return(<>
    <Stack direction="row" spacing={2} alignItems="top">
      <StyledTextField
        name="actionValue"
        value={actionValue}
        onChange={handleChange}
        label={actionValueName || "Action Value"}
        type="number"
        sx={{width: 110}}
        disabled={edited}
        helperText={actionValueHelperText}
      />
      <Stack direction="row" spacing={2} alignItems="top">
        { CS.attackValues(attacker).map((valueName: string) => (
          <Button
            key={valueName}
            variant={ actionValueName === valueName ? "contained" : "outlined" }
            disabled={edited || !attacker.id}
            onClick={() => setAttack(valueName)}
            disableElevation={actionValueName === valueName}
            sx={{height: 56}}
          >
            { attacker.id ? valueName : "Attack" } { CES.adjustedActionValue(attacker, valueName, fight, false)[1] }{ CS.impairments(attacker) ? "*" : "" }
          </Button>
        ))}
      </Stack>
    </Stack>
    <Stack direction="row" spacing={2} alignItems="top" sx={{height: 80, mt: 2}}>
      <StyledTextField disabled={edited} name="damage" value={damage} helperText={damageHelperText} onChange={handleChange} label="Damage" type="number" sx={{width: 80}} />
      <WeaponAutocomplete disabled={edited} character={attacker} weapon={weapon} setWeapon={setWeapon} />
      <FormControlLabel disabled={edited} label="Stunt" name="stunt" control={<Switch checked={stunt} />} onChange={handleCheck} />
    </Stack>
  </>)
}
