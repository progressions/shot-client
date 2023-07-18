import { Tooltip, Divider, Grid, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Box, Typography, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { rollDie, rollExplodingDie, rollSwerve } from "./dice/DiceRoller"
import CasinoIcon from "@mui/icons-material/Casino"
import { StyledTextField, SaveCancelButtons, StyledDialog } from "./StyledFields"
import EnemiesAutocomplete from "./mooks/EnemiesAutocomplete"
import type { Character } from "../types/types"
import { defaultCharacter } from "../types/types"
import Smackdowns from "./mooks/Smackdowns"
import CS from "../services/CharacterService"
import AS, { AttackRollType } from "../services/ActionService"

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
  const [rolls, setRolls] = useState<AttackRollType[]>([])
  const [enemy, setEnemy] = useState<Character>(defaultCharacter)

  useEffect(() => {
    if (count) {
      setValue(oldValue => ({...oldValue, count: count}))
    }
  }, [count])

  useEffect(() => {
    const defense = CS.defense(enemy)
    setValue(oldValue => ({...oldValue, defense: defense || defaultValue.defense}))
  }, [enemy, defaultValue.defense])

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

  const RollOutcome = ({ attackRoll }: { attackRoll: AttackRollType }) => {
    const style = (attackRoll.success) ? {color: "red", fontWeight: "bold"} : {}

    return (
      <Grid item xs={2}>
        <Typography sx={style} variant='h5'>
          {attackRoll.actionResult}
        </Typography>
      </Grid>
    )
  }

  const buttonWithTooltip = (icon: React.ReactElement | undefined) => {
    if (icon) {
      return (
        <Tooltip title="Mook Attacks" arrow>
          {icon}
        </Tooltip>
      )
    } else {
      return (
        "Mooks"
      )
    }
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>{ buttonWithTooltip(icon) }</Button>
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
                  rolls.map((attackRoll: AttackRollType, index: number) => <RollOutcome attackRoll={attackRoll} key={index} />)
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
