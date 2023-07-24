import { GiDeathSkull, GiShotgun, GiPistolGun } from "react-icons/gi"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"
import PersonOffIcon from "@mui/icons-material/PersonOff"
import TaxiAlertIcon from "@mui/icons-material/TaxiAlert"
import { ButtonGroup, FormControlLabel, Switch, Tooltip, DialogContent, Button, IconButton, Typography, Box, Stack } from "@mui/material"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { StyledDialog, StyledTextField } from "../StyledFields"
import { useEffect, useReducer, useState } from "react"
import CharactersAutocomplete from "./CharactersAutocomplete"
import type { Weapon, Character } from "../../types/types"
import { defaultWeapon, defaultCharacter } from "../../types/types"
import AS from "../../services/ActionService"
import CS from "../../services/CharacterService"
import CES from "../../services/CharacterEffectService"
import { defaultSwerve, AttackActions, initialAttackState, attackReducer } from "../../reducers/attackState"
import { FightActions } from "../../reducers/fightState"
import ResultsDisplay from "./ResultsDisplay"
import Attacker from "./Attacker"
import Target from "./Target"
import SwerveButton from "./SwerveButton"

interface AttackModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  anchorEl: Element | null
  setAnchorEl: React.Dispatch<React.SetStateAction<Element | null>>
}

export default function AttackModal({ open, setOpen, anchorEl, setAnchorEl }: AttackModalProps) {
  const { fight, dispatch:dispatchFight } = useFight()
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const [state, dispatch] = useReducer(attackReducer, initialAttackState)
  const { weapon, damage, outcome, wounds, success, attacker, target, defense, swerve, count,
    stunt, typedSwerve, edited, smackdown, toughness, actionValueName, actionValue, actionResult } = state
  const { result } = swerve

  useEffect(() => {
    dispatch({ type: AttackActions.RESET })

    const firstUp = fight.shot_order[0][1][0]
    if (CS.isCharacter(firstUp)) {
      dispatch({ type: AttackActions.UPDATE, payload: { fight: fight } })
      setAttacker(firstUp)
    }
  }, [open])

  function handleClose() {
    setOpen(false)
    setAnchorEl(null)
  }

  function rollSwerve() {
    const swerve = AS.swerve()
    dispatch({ type: AttackActions.UPDATE, payload: { swerve } })
  }

  function setWeapon(weapon: Weapon) {
    dispatch({ type: AttackActions.UPDATE, payload: { weapon, damage: weapon?.damage } })
  }

  function setAttacker(character: Character) {
    if (character?.id) {
      dispatch({ type: AttackActions.ATTACKER, payload: { attacker: character } })
    } else {
      dispatch({ type: AttackActions.ATTACKER, payload: { attacker: defaultCharacter } })
    }
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
    if (!smackdown) return

    try {
      await client.updateCharacter(target, fight)
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${target.name} took ${wounds} wounds.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  async function killMooks() {
    if (!count) return

    try {
      await client.updateCharacter(target, fight)
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${target.name} killed ${count} ${count == 1 ? "mook" : "mooks"}.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  return (
    <>
      <StyledDialog
        open={open}
        onClose={handleClose}
        title="Attack"
        width="lg"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "600px",  // Set your width here
            },
          },
        }}
      >
        <DialogContent>
          <Stack spacing={2}>
            <CharactersAutocomplete
              label="Attacker"
              character={attacker}
              setCharacter={setAttacker}
              disabled={edited}
            />
            <Attacker
              state={state}
              setAttacker={setAttacker}
              setWeapon={setWeapon}
              setAttack={setAttack}
              handleChange={handleChange}
              handleCheck={handleCheck}
            />
            <CharactersAutocomplete
              disabled={edited}
              label="Target"
              character={target}
              setCharacter={setTarget}
            />
            <Target
              state={state}
              setTarget={setTarget}
              handleChange={handleChange}
            />
            <SwerveButton
              state={state}
              handleSwerve={handleSwerve}
              handleAttack={handleAttack}
            />
            { edited && <ResultsDisplay state={state} handleClose={handleClose} /> }
            { edited && !!target?.id && !CS.isMook(target) && !!wounds && <>
              <Button sx={{width: 200}} endIcon={<HeartBrokenIcon />} variant="contained" color="error" onClick={applyWounds}>Apply Wounds</Button>
            </> }
            { edited && !!target?.id && CS.isMook(target) && wounds && <>
              <Button sx={{width: 200}} endIcon={<PersonOffIcon />} variant="contained" color="error" onClick={killMooks}>Kill Mooks</Button>
            </> }
            { edited && <Button onClick={resetAttack} variant="contained" color="primary">Reset</Button> }
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
