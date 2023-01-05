import { Divider, Grid, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Box, Typography, TextField } from '@mui/material'
import { useState } from 'react'
import { rollDie, rollExplodingDie } from './DiceRoller'

export default function MookRolls({ count, attack, damage, icon }: any) {
  const defaultValue = {count: count || '10', attack: attack || '8', defense: '13', damage: damage || '10'}
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const [rolls, setRolls] = useState<number[]>([])

  const handleChange = (event: any) => {
    setValue({...value, [event.target.name]: event.target.value})
  }

  const handleClose = () => {
    setOpen(false)
    setValue(defaultValue)
    setRolls([])
  }

  const generateRolls = (event: any) => {
    event.preventDefault()
    setRolls([])
    const count = parseInt(value.count) || 0
    for (var i = 0; i < count; i++) {
      const [dieRolls, result] = rollExplodingDie(rollDie)
      setRolls((oldArray: any) => [...oldArray, (result + parseInt(value.attack))])
    }
  }

  const RollOutcome = ({ outcome, value }: any) => {
    const defense = parseInt(value.defense) || 0
    const winner = outcome >= defense
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
      .filter((roll: number) => (roll >= parseInt(value.defense)))
      .map((outcome, index) => <Typography key={(Math.random() * 10000)}>{outcome}: You take a smackdown of {outcome - parseInt(value.defense) + parseInt(value.damage)}</Typography>)
    )
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>{ icon || "Mook Rolls" }</Button>
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
                <TextField name="count" autoFocus value={value.count} onChange={handleChange} label="Count" required sx={{width: 150}} />
                <TextField name="attack" value={value.attack} onChange={handleChange} label="Attack" required sx={{width: 150}} />
                <TextField name="defense" value={value.defense} onChange={handleChange} label="Defense" required sx={{width: 150}} />
                <TextField name="damage" value={value.damage} onChange={handleChange} label="Damage" required sx={{width: 150}} />
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
