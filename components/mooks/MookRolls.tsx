import { Tooltip, Divider, Grid, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Box, Typography, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import CasinoIcon from "@mui/icons-material/Casino"
import { StyledTextField, SaveCancelButtons, StyledDialog } from "../StyledFields"
import EnemiesAutocomplete from "./EnemiesAutocomplete"
import type { AttackRoll, Character } from "../../types/types"
import { defaultCharacter } from "../../types/types"
import Smackdowns from "./Smackdowns"
import CS from "../../services/CharacterService"
import VS from "../../services/VehicleService"
import AS from "../../services/ActionService"
import CES from "../../services/CharacterEffectService"
import RollOutcome from "./RollOutcome"
import ButtonWithTooltip from "./ButtonWithTooltip"
import { useFight } from "../../contexts/FightContext"

interface MookRollsParams {
  count?: number,
  attack?: number
  defense?: number
  damage?: number
  icon?: React.ReactElement
}

export interface MookRollValue {
  count: number,
  attack: number,
  defense: number,
  damage: number
}

export interface RollOutcomeParams {
  actionResult: number,
  defense: number
}

export default function MookRolls({ count, attack, damage, icon }: MookRollsParams) {
  const defaultValue:MookRollValue = {count: count || 10, attack: attack || 8, defense: 13, damage: damage || 7}
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<MookRollValue>(defaultValue)
  const [rolls, setRolls] = useState<AttackRoll[]>([])
  const [enemy, setEnemy] = useState<Character>(defaultCharacter)
  const { fight } = useFight()

  useEffect(() => {
    if (count) {
      setValue(oldValue => ({...oldValue, count: count}))
    }
  }, [count])

  useEffect(() => {
    const [_adjustment, defense] = CES.adjustedActionValue(enemy, "Defense", fight)
    setValue(oldValue => ({...oldValue, defense: defense || defaultValue.defense}))
  }, [enemy, fight, defaultValue.defense])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue({...value, [event.target.name]: parseInt(event.target.value)})
  }

  const handleClose = (): void => {
    setOpen(false)
    setValue(defaultValue)
    setRolls([])
  }

  const generateRolls = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault()
    setRolls([])
    const attacks = AS.attacks({ count: value.count, actionValue: value.attack, defense: value.defense, damage: value.damage, toughness: CS.toughness(enemy) })
    setRolls(attacks)
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        <ButtonWithTooltip icon={icon} />
      </Button>
      <StyledDialog
        open={open}
        onClose={handleClose}
        onSubmit={generateRolls}
        title="Mook Rolls"
      >
        <DialogContent>
          <DialogContentText>
            Generate some mook rolls
          </DialogContentText>
          <Box py={2} sx={{width: 500}}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <StyledTextField name="count" type="number" autoFocus value={value.count || 0} onChange={handleChange} label="Mooks" required sx={{width: 140}} />
                <StyledTextField name="attack" type="number" value={value.attack || 0} onChange={handleChange} label="Attack" required sx={{width: 150}} />
                <StyledTextField name="defense" type="number" value={value.defense || 0} onChange={handleChange} label="Target Defense" required sx={{width: 160}} />
                <StyledTextField name="damage" type="number" value={value.damage || 0} onChange={handleChange} label="Damage" required sx={{width: 150}} />
              </Stack>
            </Stack>
            <Box py={2}>
              <EnemiesAutocomplete enemy={enemy} setEnemy={setEnemy} />
            </Box>
            <Box py={2}>
              <Grid container sx={{width: "100%"}}>
                {
                  rolls.map((attackRoll: AttackRoll, index: number) => <RollOutcome attackRoll={attackRoll} key={index} />)
                }
              </Grid>
            </Box>
            <Divider />
            <Box py={2}>
              <Smackdowns enemy={enemy} attackRolls={rolls} value={value} handleClose={handleClose} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <SaveCancelButtons onCancel={handleClose} saveText="Roll!" />
        </DialogActions>
      </StyledDialog>
    </>
  )
}
