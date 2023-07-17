import { Tooltip, Divider, Grid, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Box, Typography, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { rollDie, rollExplodingDie } from "../../dice/DiceRoller"
import CasinoIcon from "@mui/icons-material/Casino"
import { StyledTextField, SaveCancelButtons, StyledDialog } from "../../StyledFields"
import EnemiesAutocomplete from "./EnemiesAutocomplete"
import type { Vehicle } from "../../../types/types"
import { defaultVehicle } from "../../../types/types"
import Smackdowns from "./Smackdowns"

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
  outcome: number,
  value: MookRollValue
}

export default function MookRolls({ count, attack, damage, icon }: MookRollsParams) {
  const defaultValue:MookRollValue = {count: count || 10, attack: attack || 7, defense: 7, damage: damage || 7}
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<MookRollValue>(defaultValue)
  const [rolls, setRolls] = useState<number[]>([])
  const [enemy, setEnemy] = useState<Vehicle>(defaultVehicle)

  console.log(enemy)

  useEffect(() => {
    if (count) {
      setValue(oldValue => ({...oldValue, count: count}))
    }
  }, [count])

  useEffect(() => {
    if (enemy?.skills && enemy?.skills["Driving"]) {
      setValue(oldValue => ({...oldValue, defense: enemy.skills["Driving"] as number}))
    } else if (enemy?.driver?.skills && enemy?.driver?.skills["Driving"]) {
      setValue(oldValue => ({...oldValue, defense: enemy.driver.skills["Driving"] as number}))
    } else {
      setValue(oldValue => ({...oldValue, defense: defaultValue.defense}))
    }
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
    const count: number = value.count
    for (var i = 0; i < count; i++) {
      const [dieRolls, result]: [number[], number] = rollExplodingDie(rollDie)
      setRolls((oldArray: number[]) => [...oldArray, (result + value.attack)])
    }
  }

  const RollOutcome = ({ outcome, value }: RollOutcomeParams) => {
    const defense: number = value.defense
    const winner: boolean = outcome >= defense
    const style = (value.defense && winner) ? {color: 'red', fontWeight: 'bold'} : {}

    return (
      <Grid item xs={2}>
        <Typography sx={style} variant='h5'>
          {outcome}
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
                <StyledTextField name="count" type="number" autoFocus value={value.count || ""} onChange={handleChange} label="Mooks" required sx={{width: 140}} />
                <StyledTextField name="attack" type="number" value={value.attack || ""} onChange={handleChange} label="Driving" required sx={{width: 160}} helperText="Attack" />
                <StyledTextField name="defense" type="number" value={value.defense || ""} onChange={handleChange} label="Target Driving" required sx={{width: 160}} helperText="Defense" />
                <StyledTextField name="damage" type="number" value={value.damage || ""} onChange={handleChange} label="Squeal" required sx={{width: 150}} helperText="Chase Points" />
              </Stack>
            </Stack>
            <Box py={2}>
              <EnemiesAutocomplete enemy={enemy} setEnemy={setEnemy} />
            </Box>
            <Box py={2}>
              <Grid container sx={{width: "100%"}}>
                {
                  rolls.map((outcome, index) => <RollOutcome outcome={outcome} value={value} key={index} />)
                }
              </Grid>
            </Box>
            <Divider />
            <Box py={2}>
              <Smackdowns enemy={enemy} rolls={rolls} value={value} handleClose={handleClose} />
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
