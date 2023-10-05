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

interface TargetProps {
  state: AttackState
  setTarget: (character: Character) => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Target({ state, setTarget, handleChange }: TargetProps) {
  const { attacker, target, defense, toughness, edited } = state
  const [dodged, setDodged] = useState(false)
  const { client } = useClient()
  const { fight, dispatch } = useFight()
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
      handleChange({ target: { name: "defense", value: defense + 3 } } as React.ChangeEvent<HTMLInputElement>)
      dispatch({ type: FightActions.EDIT })
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
