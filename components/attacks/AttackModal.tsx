import { GiDeathSkull, GiShotgun, GiPistolGun } from "react-icons/gi"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"
import PersonOffIcon from "@mui/icons-material/PersonOff"
import TaxiAlertIcon from "@mui/icons-material/TaxiAlert"
import BoltIcon from '@mui/icons-material/Bolt'
import { colors, Paper, ButtonGroup, FormControlLabel, Switch, Tooltip, DialogContent, Button, IconButton, Typography, Box, Stack } from "@mui/material"
import { useFight } from "@/contexts/FightContext"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { StyledTextField } from "@/components/StyledFields"
import { useEffect, useReducer, useState } from "react"
import type { Weapon, Character, Fight } from "@/types/types"
import { defaultWeapon, defaultCharacter, CharacterTypes } from "@/types/types"
import AS from "@/services/ActionService"
import CS from "@/services/CharacterService"
import CES from "@/services/CharacterEffectService"
import FS from "@/services/FightService"
import FES from "@/services/FightEventService"
import { AttackActions, initialAttackState, attackReducer } from "@/reducers/attackState"
import { FightActions } from "@/reducers/fightState"

import Attacker from "@/components/attacks/Attacker"
import Target from "@/components/attacks/Target"
import SwerveButton from "@/components/attacks/SwerveButton"
import ResultsDisplay from "@/components/attacks/ResultsDisplay"
import CharactersAutocomplete from "@/components/attacks/CharactersAutocomplete"

interface AttackModalProps {
}

export default function AttackModal({ }: AttackModalProps) {
  const { fight, dispatch:dispatchFight } = useFight()
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const [state, dispatch] = useReducer(attackReducer, initialAttackState)
  const { wounds, attacker, target, swerve, count, damage, dodged,
    typedSwerve, shots, edited } = state

  useEffect(() => {
    dispatch({ type: AttackActions.RESET })

    const firstUp = FS.firstUp(fight)
    if (firstUp && CS.isCharacter(firstUp)) {
      dispatch({ type: AttackActions.UPDATE, payload: { fight: fight } })
      setAttacker(firstUp)
    }
  }, [fight])

  useEffect(() => {
    if (CS.isType(attacker, [CharacterTypes.Boss, CharacterTypes.UberBoss])) {
      dispatch({ type: AttackActions.UPDATE, payload: { shots: 2 } })
    } else {
      dispatch({ type: AttackActions.UPDATE, payload: { shots: 3 } })
    }
  }, [attacker])

  function handleClose() {
    dispatchFight({ type: FightActions.UPDATE, name: "attacking", value: false })
  }

  function rollSwerve() {
    const swerve = AS.swerve()
    dispatch({ type: AttackActions.UPDATE, payload: { swerve } })
  }

  function setWeapon(weapon: Weapon) {
    dispatch({ type: AttackActions.WEAPON, payload: { weapon } })
  }

  function setAttacker(character: Character) {
    dispatch({ type: AttackActions.ATTACKER, payload: { attacker: character } })
  }

  function setTarget(character: Character) {
    dispatch({ type: AttackActions.TARGET, payload: { target: character } })
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    dispatch({ type: AttackActions.UPDATE, payload: { [name]: value } })
  }

  function handleSwerve(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    dispatch({ type: AttackActions.UPDATE, payload: { typedSwerve: value } })
  }

  function handleCheck(event: React.SyntheticEvent<Element, Event>, checked: boolean) {
    dispatch({ type: AttackActions.UPDATE, payload: { stunt: checked } })
  }

  function setAttack(actionValueName: string) {
    // move this into the reducer
    const [_adjustment, actionValue] = CES.adjustedActionValue(attacker, actionValueName, fight, false)
    if (actionValueName == state.actionValueName) {
      dispatch({ type: AttackActions.UPDATE, payload: { actionValueName: "" } })
    } else {
      dispatch({ type: AttackActions.UPDATE, payload: { actionValueName, actionValue } })
    }
  }

  function handleAttack() {
    if (typedSwerve == "" || typedSwerve == null) {
      const swerve = AS.swerve()
      dispatch({ type: AttackActions.UPDATE, payload: { swerve, typedSwerve: "" } })
    }
    dispatch({ type: AttackActions.EDIT })
  }

  function resetAttack() {
    dispatch({ type: AttackActions.UPDATE, payload: { edited: false, typedSwerve: "" } })
  }

  async function applyWounds() {
    try {
      await Promise.all([
        client.actCharacter(attacker, fight as Fight, shots),
        client.updateCharacter(target, fight),
        FES.attack(client, fight, attacker, target, wounds || 0, shots || 0)
      ])
      if (dodged) {
        await FES.dodge(client, fight, target, 1)
      }
      if (!!wounds) {
        toastSuccess(`${target.name} took ${wounds} wounds. ${attacker.name} spent ${shots} ${shots == 1 ? "Shot" : "Shots"}.`)
      } else {
        toastSuccess(`${attacker.name} spent ${shots} ${shots == 1 ? "Shot" : "Shots"}.`)
      }
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  async function killMooks() {
    try {
      await Promise.all([
        client.updateCharacter(target, fight),
        FES.killMooks(client, fight, attacker, target, count, shots)
      ])
      dispatchFight({ type: FightActions.EDIT })
      if (!!count) {
        toastSuccess(`${attacker.name} killed ${count} ${target.name} ${count == 1 ? "mook" : "mooks"} and spent ${shots} ${shots == 1 ? "Shot" : "Shots"}.`)
      } else {
        toastSuccess(`${attacker.name} spent ${shots} ${shots == 1 ? "Shot" : "Shots"}.`)
      }
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  return (
    <>
      <Paper sx={{ p: 2, mb: 2, backgroundColor: colors.blueGrey[300] }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="top">
              <Box sx={{width: "50%", mb: 2}}>
                <Stack direction="row" spacing={2}>
                  <Box sx={{ width: "100%", height: 70, pb: 2 }}>
                    <CharactersAutocomplete
                      label="Attacker"
                      character={attacker}
                      setCharacter={setAttacker}
                      disabled={edited}
                    />
                  </Box>
                  <StyledTextField type="number" label="Shots" required name="shots" value={shots || ''} onChange={handleChange} />
                </Stack>
                <Attacker
                  state={state}
                  setAttacker={setAttacker}
                  setWeapon={setWeapon}
                  setAttack={setAttack}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                />
              </Box>
              <Box sx={{ width: "50%", mb: 2 }}>
                <Box sx={{ width: "100%", height: 70, pb: 2 }}>
                  <CharactersAutocomplete
                    key={`target-${attacker?.id}`}
                    disabled={edited}
                    label="Target"
                    character={target}
                    setCharacter={setTarget}
                    excludeCharacters={[attacker]}
                  />
                </Box>
                <Target
                  state={state}
                  setTarget={setTarget}
                  handleChange={handleChange}
                  dispatch={dispatch}
                />
              </Box>
            </Stack>
            <Box sx={{ alignSelf: "center", mb: 2 }}>
              <SwerveButton
                state={state}
                handleSwerve={handleSwerve}
                handleAttack={handleAttack}
              />
            </Box>
            { edited && <ResultsDisplay state={state} handleClose={handleClose} /> }
            { edited && !wounds && !CS.isMook(target) && <>
              <Button sx={{width: 200}} endIcon={<BoltIcon />} variant="contained" color="error" onClick={applyWounds}>Apply</Button>
            </> }
            { edited && !!target?.id && !!wounds && !!count && <>
              <Button sx={{width: 200}} endIcon={<HeartBrokenIcon />} variant="contained" color="error" onClick={applyWounds}>Apply Wounds</Button>
            </> }
            { edited && !!target?.id && CS.isMook(target) && wounds && <>
              <Button sx={{width: 200}} endIcon={<PersonOffIcon />} variant="contained" color="error" onClick={killMooks}>Kill Mooks</Button>
            </> }
            { edited && <Button onClick={resetAttack} variant="contained" color="primary">Reset</Button> }
          </Stack>
        </Paper>
    </>
  )
}
