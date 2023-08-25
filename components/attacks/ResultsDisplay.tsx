import { AttackState } from "@/reducers/attackState"
import { Typography, Stack } from "@mui/material"
import MookResults from "@/components/attacks//MookResults"
import MookAttackResults from "@/components/attacks//MookAttackResults"
import Results from "@/components/attacks//Results"
import CS from "@/services/CharacterService"

interface ResultsDisplayProps {
  state: AttackState
  handleClose: () => void
}

export default function ResultsDisplay({ state, handleClose }: ResultsDisplayProps) {
  const { attacker, target } = state

  if (CS.isMook(target)) return (<MookResults state={state} />)
  if (CS.isMook(attacker)) return (<MookAttackResults state={state} handleClose={handleClose} />)

  return (<Results state={state} />)
}
