import { AttackState } from "../../reducers/attackState"
import { Typography, Stack } from "@mui/material"

interface ResultsProps {
  state: AttackState
}

export default function Results({ state }: ResultsProps) {
  const { weapon, damage, outcome, wounds, success, attacker, target, defense, swerve,
    stunt, typedSwerve, edited, smackdown, toughness, actionValueName, actionValue,
    modifiedActionValue, modifiedDefense, actionResult } = state
  const { boxcars, result } = swerve

  console.log(swerve)

  const subtitleStyle = { fontSize: 14 }

  if (!actionValueName && !defense && !toughness && parseInt(modifiedActionValue) <= 7) {
    return (<>
      <Typography variant="h4">{ boxcars && "Boxcars!" } { attacker.name || "You" } rolled a swerve of {result}!</Typography>
      { typedSwerve == "" && <Typography variant="subtitle1" sx={subtitleStyle}>
        {swerve.positive} - {swerve.negative}
      </Typography> }
    </>)
  }

  if (!actionValueName && !defense && !toughness && parseInt(modifiedActionValue) > 7) {
    return (<>
      <Typography variant="h4">{ boxcars && "Boxcars!" } { attacker.name || "You" } rolled an Action Result of {actionResult}!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + Action Value { modifiedActionValue }
      </Typography>
    </>)
  }

  if (actionValueName && !defense && !toughness) {
    return (<>
      <Typography variant="h4">{ boxcars && "Boxcars!" } { attacker.name || "You" } rolled an Action Result of {actionResult}!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + { actionValueName } { modifiedActionValue }
      </Typography>
    </>)
  }

  if (!success && !actionValueName && defense) {
    return (<>
      <Typography variant="h4">{ boxcars && "Boxcars" } Miss!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + Action Value { modifiedActionValue } &lt; { target.name ? `${target.name}'s` : "" } Defense { modifiedDefense }
      </Typography>
    </>)
  }

  if (!success && actionValueName && defense) {
    return (<>
      <Typography variant="h4">{ boxcars && "Boxcars" } Miss!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + { actionValueName } { modifiedActionValue } &lt; { target.name ? `${target.name}'s` : "" } Defense { modifiedDefense }
      </Typography>
    </>)
  }

  if (success && !actionValueName && defense && !toughness && !damage) {
    return (<>
      <Typography variant="h4">{ boxcars && "Boxcars"} Hit! { attacker.name || "You" } rolled an Outcome of {outcome}!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + Action Value { modifiedActionValue } - { target.name ? `${target.name}'s` : "" } Defense { modifiedDefense }
      </Typography>
    </>)
  }

  if (success && actionValueName && defense && !toughness && damage) {
    return (<>
      <Typography variant="h4">{ boxcars && "Boxcars" } Hit! { attacker.name || "You" } rolled a Smackdown of {smackdown}!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + { actionValueName } { modifiedActionValue } - Defense { modifiedDefense } + { weapon?.name ? weapon.name : "Damage" }&nbsp;{ damage }
      </Typography>
    </>)
  }

  if (success && actionValueName && defense && toughness && damage) {
    return (<>
      <Typography variant="h4">{ boxcars && "Boxcars" } Hit! { attacker.name || "You" } inflicted { wounds || 0 } { wounds == 1 ? "Wound" : "Wounds" } { target.name ? `to ${target.name}` : ""}</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + { actionValueName } { modifiedActionValue } - { target.name ? `${target.name}'s` : "" } Defense { modifiedDefense } + { weapon?.name ? weapon.name : "Damage" }&nbsp;{ damage } - { target.name ? `${target.name}'s` : "" }&nbsp;Toughness&nbsp;{ toughness }
      </Typography>
    </>)
  }

  console.log(state)

  return (
    <><p>Hello</p></>
  )
}
