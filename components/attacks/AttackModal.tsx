import { GiDeathSkull, GiShotgun, GiPistolGun } from "react-icons/gi"
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import { FormControlLabel, Switch, Tooltip, DialogContent, Button, IconButton, Typography, Box, Stack } from "@mui/material"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { StyledDialog, StyledTextField } from "../StyledFields"
import { useEffect, useReducer, useState } from "react"
import CharactersAutocomplete from "./CharactersAutocomplete"
import WeaponAutocomplete from "./WeaponAutocomplete"
import type { Weapon, Character } from "../../types/types"
import { defaultWeapon, defaultCharacter } from "../../types/types"
import SwerveButton from "../dice/SwerveButton"
import AS from "../../services/ActionService"
import CS from "../../services/CharacterService"
import CES from "../../services/CharacterEffectService"
import { defaultSwerve, AttackActions, initialAttackState, attackReducer } from "../../reducers/attackState"
import { FightActions } from "../../reducers/fightState"
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CasinoIcon from '@mui/icons-material/Casino'
import Results from "./Results"

interface AttackModalProps {
}

export default function AttackModal({ }: AttackModalProps) {
  const { fight, dispatch:dispatchFight } = useFight()
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const [state, dispatch] = useReducer(attackReducer, initialAttackState)
  const { weapon, damage, outcome, wounds, success, attacker, target, defense, swerve,
    stunt, typedSwerve, edited, smackdown, toughness, actionValueName, actionValue, actionResult } = state
  const { result } = swerve

  console.log(state)

  function handleOpen(event: React.SyntheticEvent<Element, Event>) {
    dispatch({ type: AttackActions.RESET })

    const firstUp = fight.shot_order[0][1][0]
    dispatch({ type: AttackActions.UPDATE, payload: { fight: fight } })
    setAttacker(firstUp)
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }

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
    const [_adjustment, adjustedMainAttack] = CES.adjustedMainAttack(character, fight)
    dispatch({ type: AttackActions.UPDATE, payload: { attacker: character, actionValueName: CS.mainAttack(character) || "", actionValue: adjustedMainAttack, weapon: defaultWeapon, damage: CS.damage(character) || 7 } })
  }

  function setTarget(character: Character) {
    const [_defenseAdjustment, adjustedDefense] = CES.adjustedActionValue(character, "Defense", fight, false)
    const [_toughnessAdjustment, adjustedToughness] = CES.adjustedActionValue(character, "Toughness", fight, true)
    dispatch({ type: AttackActions.UPDATE, payload: { target: character, defense: adjustedDefense, toughness: adjustedToughness } })
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
    dispatch({ type: AttackActions.UPDATE, payload: { edited: false } })
  }

  async function applyWounds() {
    const updatedTarget = CS.takeSmackdown(target, smackdown)

    try {
      await client.updateCharacter(updatedTarget, fight)
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${target.name} took ${wounds} wounds.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<GiPistolGun />}
        onClick={handleOpen}
      >
        Attack
      </Button>
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
            <Stack direction="row" spacing={2} alignItems="top">
              <StyledTextField
                name="actionValue"
                value={actionValue}
                onChange={handleChange}
                label="Action Value"
                type="number"
                sx={{width: 110}}
                disabled={edited}
              />
              <Stack direction="row" spacing={2} alignItems="top">
                { CS.attackValues(attacker).map((valueName) => (
                  <Button
                    key={valueName}
                    variant={ actionValueName === valueName ? "contained" : "outlined" }
                    disabled={edited || !attacker.id}
                    onClick={() => setAttack(valueName)}
                    disableElevation={actionValueName === valueName}
                  >
                    { attacker.id ? valueName : "Attack" } { CES.adjustedActionValue(attacker, valueName, fight, false)[1] }{ CS.impairments(attacker) ? "*" : "" }
                  </Button>
                ))}
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="top" sx={{height: 80}}>
              <StyledTextField disabled={edited} name="damage" value={damage} onChange={handleChange} label="Damage" type="number" sx={{width: 80}} />
              <WeaponAutocomplete disabled={edited} character={attacker} weapon={weapon} setWeapon={setWeapon} />
              <FormControlLabel label="Stunt" name="stunt" control={<Switch checked={stunt} />} onChange={handleCheck} />
            </Stack>
            <CharactersAutocomplete disabled={edited} label="Target" character={target} setCharacter={setTarget} />
            <Stack direction="row" spacing={2} alignItems="top">
              <StyledTextField disabled={edited} name="defense" value={defense} onChange={handleChange} label="Defense" type="number" sx={{width: 110}} />
              <StyledTextField disabled={edited} name="toughness" value={toughness} onChange={handleChange} label="Toughness" type="number" sx={{width: 110}} />
            </Stack>
            <Stack direction="row" spacing={5} alignItems="top">
              { !edited && <StyledTextField name="typedSwerve" value={typedSwerve || ""} onChange={handleSwerve} label="Swerve" type="number" InputProps={{sx: {height: 80, width: 120, fontSize: 50, fontWeight: "bold"}}} /> }
              { !edited &&
              <Button sx={{width: 400, fontSize: 20}} endIcon={<PlayArrowIcon />} onClick={handleAttack} variant="contained" color="error">
                { typedSwerve ? "Attack" : "Roll the Dice" }
              </Button>
              }
            </Stack>
            { edited && <Results state={state} /> }
            { edited && target?.id && wounds > 0 && <>
              <Button sx={{width: 200}} endIcon={<HeartBrokenIcon />} variant="contained" color="error" onClick={applyWounds}>Apply Wounds</Button>
            </> }
            { edited && <Button onClick={resetAttack} variant="contained" color="primary">Reset</Button> }
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
