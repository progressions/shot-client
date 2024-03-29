import { StyledDialog } from "@/components/StyledFields"
import { Stack, Avatar, Tooltip, Button, IconButton, Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material'
import CasinoIcon from '@mui/icons-material/Casino'
import { useState } from 'react'
import DS from "@/services/DiceService"
import { Swerve } from "@/types/types"

export default function DiceRoller() {
  const [open, setOpen] = useState<boolean>(false)
  const [rolls, setRolls] = useState<Swerve>({ result: 0, positiveRolls: [], negativeRolls: [], positive: null, negative: null, boxcars: false })
  const [title, setTitle] = useState<string>('')

  const showExplodingRoll = (): void => {
    const rolls = DS.rollSwerve()
    setTitle("Swerve")
    setRolls(rolls)
    setOpen(true)
  }

  const showSingleRoll = (): void => {
    const sum = DS.rollDie()
    setTitle("Single Die Roll")
    setRolls((rolls) => ({ ...rolls, result: sum }))
    setOpen(true)
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
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
      </Stack>
      <StyledDialog open={open} onClose={() => setOpen(false)} title={title}>
        <DialogContent>
          <Box p={4}>
            <Stack spacing={1}>
              { rolls.boxcars && <Typography variant="h4">Boxcars!</Typography> }
              <Stack direction="row" spacing={1}>
                { rolls.positiveRolls?.map((roll, index) => <Avatar key={"positive" + index} sx={{ backgroundColor: "red", color: "black", width: 40, height: 40 }} variant="rounded">{roll}</Avatar>) }
              </Stack>
              <Stack direction="row" spacing={1}>
                { rolls.negativeRolls?.map((roll, index) => <Avatar key={"negative" + index} sx={{ backgroundColor: "white", color: "black", width: 40, height: 40 }} variant="rounded">{roll}</Avatar>) }
              </Stack>
              <Typography align='center' variant="h3">
                { rolls.result }
              </Typography>
            </Stack>
          </Box>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
