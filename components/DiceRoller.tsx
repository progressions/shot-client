import { Tooltip, IconButton, Dialog, Box, Typography} from '@mui/material'
import CasinoIcon from '@mui/icons-material/Casino'
import { useState } from 'react'

export const roll = () => {
  const result = Math.floor(Math.random() * 6) + 1
  return result
}

export const explodingRoll = (roll) => {
  let result = roll()
  let total = []
  do {
    result = roll()
    total.push(result)
  }
  while (result == 6)

  return [total, total.reduce((sum, num) => {return (sum + num)}, 0)]
}

export default function DiceRoller({ }) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState(null)

  const swerve = () => {
    const [posRolls, positive] = explodingRoll(roll)
    const [negRolls, negative] = explodingRoll(roll)

    const result = positive - negative
    console.log({ result })

    return result
  }

  const showExplodingRoll = () => {
    const sum = swerve()
    setResult(sum)
    setOpen(true)
  }

  return (
    <>
      <Tooltip title="Roll Swerve" arrow>
        <IconButton onClick={showExplodingRoll}>
          <CasinoIcon color='error' sx={{width: 45, height: 45}} />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box p={4}>
          <Typography variant="h3">
            {result}
          </Typography>
        </Box>
      </Dialog>
    </>
  )
}
