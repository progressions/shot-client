import { AttackState } from "@/reducers/attackState"
import { Typography, Stack } from "@mui/material"

interface ResultsProps {
  state: AttackState
}

export default function Results({ state }: ResultsProps) {
  const { weapon, damage, outcome, wounds, success, attacker, target, defense, swerve,
    stunt, typedSwerve, edited, smackdown, toughness, actionValueName, actionValue,
    modifiedActionValue, modifiedDefense, actionResult } = state
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

  // A swerve was rolled and there's no action value (Guns, Martial Arts, etc), but no target
  if (!actionValueName && !defense && !toughness && parseInt(modifiedActionValue) > 7) {
    return (<>
      <Typography variant="h5">{ statusMessage() } { attacker.name || "You" } rolled an Action Result of {actionResult}!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + Action Value { modifiedActionValue }
      </Typography>
    </>)
  }

  // A swerve was rolled but there's no action value (Guns, Martial Arts, etc)
  if (!actionValueName && defense <= 0 && toughness <= 0 && parseInt(modifiedActionValue) <= 7) {
    return (<>
      <Typography variant="h5">{ statusMessage() } { attacker.name || "You" } rolled a swerve of {result}!</Typography>
      { typedSwerve == "" && <Typography variant="subtitle1" sx={subtitleStyle}>
        {swerve.positive} - {swerve.negative}
      </Typography> }
    </>)
  }

  // A swerve was rolled and there's an action value (Guns, Martial Arts, etc), but no target
  if (actionValueName && !defense && !toughness) {
    return (<>
      <Typography variant="h5">{ statusMessage() } { attacker.name || "You" } rolled an Action Result of {actionResult}!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + { actionValueName } { modifiedActionValue }
      </Typography>
    </>)
  }

  // There's an attacker and a target, and it's a miss
  if (!success && !actionValueName && defense) {
    return (<>
      <Typography variant="h5">{ statusMessage() } Miss!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + Action Value { modifiedActionValue } &lt; { target.name ? `${target.name}'s` : "" } Defense { modifiedDefense }
      </Typography>
    </>)
  }

  if (!success && actionValueName && defense) {
    return (<>
      <Typography variant="h5">{ statusMessage() } Miss!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Action Result: { actionResult }: Swerve { result } + { actionValueName } { modifiedActionValue }
        <br />
        Action Result { actionResult } &lt; { target.name ? `${target.name}'s` : "" } Defense { modifiedDefense }
      </Typography>
    </>)
  }

  if (success && !actionValueName && defense && !toughness && !damage) {
    return (<>
      <Typography variant="h5">{ statusMessage() } Hit! { attacker.name || "You" } rolled an Outcome of {outcome}!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + Action Value { modifiedActionValue } - { target.name ? `${target.name}'s` : "" } Defense { modifiedDefense }
      </Typography>
    </>)
  }

  if (success && actionValueName && defense && !toughness && damage) {
    return (<>
      <Typography variant="h5">{ statusMessage() } Hit! { attacker.name || "You" } rolled a Smackdown of {smackdown}!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + { actionValueName } { modifiedActionValue } - Defense { modifiedDefense } + { weapon?.name ? weapon.name : "Damage" }&nbsp;{ damage }
      </Typography>
    </>)
  }

  if (success && actionValueName && defense && toughness && damage) {
    return (<>
      <Typography variant="h5">{ statusMessage() } Hit! { attacker.name || "You" } rolled a Smackdown of {smackdown}, <br />inflicting { wounds || 0 } { wounds == 1 ? "Wound" : "Wounds" } { target.name ? `to ${target.name}` : ""}</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Action Result: { actionResult }: Swerve { result } + { actionValueName } { modifiedActionValue }
        <br />
        Outcome: { outcome }: { actionResult } - { target.name ? `${target.name}'s` : "" } Defense { modifiedDefense }
        <br />
        Smackdown: { smackdown }: { outcome } + { weapon?.name ? weapon.name : "Damage" }&nbsp;{ damage }
        <br />
        Wounds: { wounds }: { smackdown } - { target.name ? `${target.name}'s` : "" } Toughness&nbsp;{ toughness }
      </Typography>
    </>)
  }

  console.log("Something didn't work", state)

  return null
}
