import { ChaseMethod, ChaseState } from "@/reducers/chaseState"
import { Typography, Stack } from "@mui/material"
import VS from "@/services/VehicleService"

interface ResultsProps {
  state: ChaseState
}

export default function Results({ state }: ResultsProps) {
  const { squeal, outcome, success, attacker, target, defense, swerve,
    stunt, typedSwerve, edited, smackdown, handling, actionValue,
    modifiedActionValue, modifiedDefense, actionResult, chasePoints,
    conditionPoints, position, method } = state
  const { boxcars, result } = swerve

  const subtitleStyle = { fontSize: 14 }

  function statusMessage() {
    if (state.wayAwfulFailure) {
      return "Way Awful Failure!"
    }
    if (state.boxcars) {
      return "Boxcars! "
    }
  }

  // attacker is pursuer
  if (VS.isPursuer(attacker)) {
    // attacker is near
    if (VS.isNear(attacker)) {
      if (success) {
        return (<>
          <Typography>You are pursuing.</Typography>
          <Typography>You sideswipe!</Typography>
          <Typography>You do {chasePoints || 0} chase points and {conditionPoints || 0} condition points.</Typography>
          <Typography>You are now {position}.</Typography>
        </>)
      }
      return (
        <>
          <Typography>You fail to sideswipe.</Typography>
          <Typography>You are still {position}.</Typography>
        </>
      )
    }

    if (success) {
      // attacker is far
      return (
        <>
          <Typography>You are pursuing.</Typography>
          <Typography>You narrow the gap!</Typography>
          <Typography>You do {chasePoints || 0} chase points.</Typography>
          <Typography>You are now {position}.</Typography>
        </>
      )
    }
    return (
      <>
        <Typography>You are pursuing.</Typography>
        <Typography>You fail to narrow the gap!</Typography>
        <Typography>You are still {position}.</Typography>
      </>
    )
  }

  // attacker is evader
  // attacker is near
  if (VS.isNear(attacker)) {
    if (success && method === ChaseMethod.RAM_SIDESWIPE) {
      return (<>
        <Typography>You are evading.</Typography>
        <Typography>You sideswipe!</Typography>
        <Typography>You do {chasePoints || 0} Chase Points and {conditionPoints || 0} Condition Points.</Typography>
        <Typography>You are still {position}.</Typography>
      </>)
    }
    if (success && method === ChaseMethod.WIDEN_THE_GAP) {
      return (<>
        <Typography>You are evading.</Typography>
        <Typography>You widen the gap!</Typography>
        <Typography>You do {chasePoints || 0} Chase Points.</Typography>
        <Typography>You are now {position}.</Typography>
      </>)
    }
    if (method === ChaseMethod.RAM_SIDESWIPE) {
      return ( <>
        <Typography>You are evading.</Typography>
        <Typography>You fail to sideswipe.</Typography>
        <Typography>You are still {position}.</Typography>
      </>)
    }
    if (method === ChaseMethod.WIDEN_THE_GAP) {
      return ( <>
        <Typography>You are evading.</Typography>
        <Typography>You fail to widen the gap!</Typography>
        <Typography>You are still {position}.</Typography>
      </>)
    }
  }

  if (success) {
    // attacker is far
    return ( <>
      <Typography>You are evading.</Typography>
      <Typography>You do {chasePoints || 0} Chase Points.</Typography>
      <Typography>You are still {position}.</Typography>
    </>)
  }
  return ( <>
    <Typography>You are evading.</Typography>
    <Typography>You fail to widen the gap!</Typography>
    <Typography>You are still {position}.</Typography>
  </>)
}
