import { Stack, Dialog, Button, Box, Typography, TextField } from '@mui/material'
import { useState } from 'react'
import { roll, explodingRoll } from './DiceRoller'

export default function MookRolls({ }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState({count: '', attack: 8})
  const [rolls, setRolls] = useState([])

  const handleChange = (event: any) => {
    setValue({...value, [event.target.name]: event.target.value})
  }

  const generateRolls = () => {
    alert("roll")
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Mook Rolls</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box p={4}>
          <Stack spacing={2}>
            <Typography variant="h3">Mook Rolls</Typography>
            <Stack direction="row" spacing={2}>
              <TextField name="count" value={value.count} onChange={handleChange} label="Count" required sx={{width: 150}} />
              <TextField name="attack" value={value.attack} onChange={handleChange} label="Attack Value" required sx={{width: 150}} />
            </Stack>
            <Button variant="contained" onClick={generateRolls}>Roll!</Button>
          </Stack>
        </Box>
      </Dialog>
    </>
  )
}
