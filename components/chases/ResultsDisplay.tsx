import { ChaseState } from "../../reducers/chaseState"
import { Typography, Stack } from "@mui/material"
import MookResults from "./MookResults"
import MookAttackResults from "./MookAttackResults"
import Results from "./Results"
import VS from "../../services/VehicleService"

interface ResultsDisplayProps {
  state: ChaseState
  handleClose: () => void
}

export default function ResultsDisplay({ state, handleClose }: ResultsDisplayProps) {
  const { attacker, target } = state

  if (VS.isMook(target)) return (<MookResults state={state} />)
  if (VS.isMook(attacker)) return (<MookAttackResults state={state} handleClose={handleClose} />)

  return (<Results state={state} />)
}
