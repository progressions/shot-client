import { Tooltip, Button, IconButton, Dialog, DialogTitle, DialogContent, Box, Typography} from '@mui/material'
import CasinoIcon from '@mui/icons-material/Casino'
import { useState } from 'react'

export const rollDie = (): number => {
  const result = Math.floor(Math.random() * 6) + 1
  return result
}

export const rollExplodingDie = (rollDie: () => number): [number[], number] => {
  let result = rollDie()
  let total = []
  do {
    result = rollDie()
    total.push(result)
  }
  while (result == 6)

  return [total, total.reduce((sum, num) => {return (sum + num)}, 0)]
}

const rollSwerve = (): number => {
  const [posRolls, positive] = rollExplodingDie(rollDie)
  const [negRolls, negative] = rollExplodingDie(rollDie)

  const result = positive - negative
  console.log({ result })

  return result
}

export default function DiceRoller() {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [title, setTitle] = useState('')

  const showExplodingRoll = (): void => {
    const sum = rollSwerve()
    setTitle("Swerve")
    setResult(sum)
    setOpen(true)
  }

  const showSingleRoll = (): void => {
    const sum = rollDie()
    setTitle("Single Die Roll")
    setResult(sum)
    setOpen(true)
  }

  return (
    <>
      <Tooltip title="Roll Single Die" arrow>
        <IconButton onClick={showSingleRoll}>
          <CasinoIcon color='error' sx={{width: 45, height: 45}} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Roll Swerve" arrow>
        <Button onClick={showExplodingRoll}>
          <Box sx={{marginLeft: -3, height: 35, bgcolor: "black", borderRadius: 3}}>
            <Box sx={{marginTop: '-13px', whiteSpace: "nowrap"}} p={1}>
              <CasinoIcon sx={{color: 'white', width: 25, height: 45}} />
              <CasinoIcon sx={{color: 'red', width: 25, height: 45}} />
            </Box>
          </Box>
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box p={4}>
            <Typography align='center' variant="h3">
              {result}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
