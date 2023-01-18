import { Tooltip, Divider, Grid, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Box, Typography, TextField } from '@mui/material'
import { useState } from 'react'
import { rollDie, rollExplodingDie } from './dice/DiceRoller'
import CasinoIcon from '@mui/icons-material/Casino'

interface MookRollsParams {
  count?: number,
  attack?: number
  defense?: number
  damage?: number
  icon?: React.ReactElement
}

interface MookRollValue {
  count: number,
  attack: number,
  defense: number,
  damage: number
}

interface RollOutcomeParams {
  outcome: number,
  value: MookRollValue
}

export default function MookRolls({ count, attack, damage, icon }: MookRollsParams) {
  const defaultValue:MookRollValue = {count: count || 10, attack: attack || 8, defense: 13, damage: damage || 7}
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<MookRollValue>(defaultValue)
  const [rolls, setRolls] = useState<number[]>([])

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

  const smackdowns = (rolls: number[]) => {
    return (rolls
      .filter((roll: number) => (roll >= value.defense))
      .map((outcome: number, index: number) => {
        return <Typography key={(Math.random() * 10000)}>{outcome}: You take a smackdown of {outcome - value.defense + value.damage}</Typography>
      })
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
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>{ buttonWithTooltip(icon) }</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        disableRestoreFocus
      >
        <Box component="form" onSubmit={generateRolls}>
        <DialogTitle>Mook Rolls</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Generate some mook rolls
          </DialogContentText>
          <Box py={2} sx={{width: 400}}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField name="count" type="number" autoFocus value={value.count} onChange={handleChange} label="Count" required sx={{width: 150}} />
                <TextField name="attack" type="number" value={value.attack} onChange={handleChange} label="Attack" required sx={{width: 150}} />
                <TextField name="defense" type="number" value={value.defense} onChange={handleChange} label="Defense" required sx={{width: 150}} />
                <TextField name="damage" type="number" value={value.damage} onChange={handleChange} label="Damage" required sx={{width: 150}} />
              </Stack>
            </Stack>
            <Box py={2}>
              <Grid container sx={{width: "100%"}}>
                {
                  rolls.map((outcome, index) => <RollOutcome outcome={outcome} value={value} key={index} />)
                }
              </Grid>
            </Box>
            <Divider />
            <Box py={2}>
              {
                smackdowns(rolls)
              }
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Roll!</Button>
        </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
