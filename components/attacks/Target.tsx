import { ButtonGroup, Tooltip, Button, Stack } from "@mui/material"
import { StyledTextField } from "@/components/StyledFields"
import type { AttackState } from "@/reducers/attackState"
import type { Character } from "@/types/types"
import CS from "@/services/CharacterService"
import TargetMook from "@/components/attacks/TargetMook"
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import { useState } from "react"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"
import { FightActions } from '@/reducers/fightState'
import { AttackActions } from "@/reducers/attackState"

interface TargetProps {
  state: AttackState
  setTarget: (character: Character) => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  dispatch: React.Dispatch<{
    type: AttackActions;
    payload?: Partial<AttackState> | undefined;
  }>
}

export default function Target({ state, setTarget, handleChange, dispatch }: TargetProps) {
  const { attacker, target, defense, toughness, edited } = state
  const [dodged, setDodged] = useState(false)
  const { client } = useClient()
  const { fight, dispatch:dispatchFight } = useFight()
  const { toastSuccess, toastError } = useToast()

  if (CS.isMook(target)) return (
    <TargetMook
      state={state}
      setTarget={setTarget}
      handleChange={handleChange}
    />
  )

  const takeDodgeAction = async (character: Character) => {
    try {
      await client.actCharacter(character, fight, 1)
      toastSuccess(`${character.name} dodged for 1 shot.`)
      dispatch({ type: AttackActions.UPDATE, payload: { defense: defense + 3 } })
      dispatchFight({ type: FightActions.EDIT })
    } catch(error) {
      toastError()
    }
    setDodged(true)
  }

  return(<>
    <Stack direction="row" spacing={2} alignItems="top">
      <StyledTextField disabled={edited} name="defense" value={defense} onChange={handleChange} label="Defense" type="number" sx={{width: 110}} />
      <StyledTextField disabled={edited} name="toughness" value={toughness} onChange={handleChange} label="Toughness" type="number" sx={{width: 110}} />
      <ButtonGroup variant="outlined" size="small" className="actionButtons">
        <Tooltip title="Dodge" arrow>
          <Button disabled={!target?.id || dodged} size="large" variant="contained" color="highlight" onClick={() => takeDodgeAction(target)}>
            <DirectionsRunIcon sx={{color: "white"}} />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Stack>
  </>)
}
