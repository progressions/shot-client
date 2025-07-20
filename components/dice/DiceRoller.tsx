import { StyledDialog } from "@/components/StyledFields"
import { Stack, Avatar, Tooltip, Button, IconButton, Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material'
import CasinoIcon from '@mui/icons-material/Casino'
import { useReducer } from 'react'
import DS from "@/services/DiceService"
import { Swerve } from "@/types/types"
import { FormActions, useForm } from '@/reducers/formState'

type FormData = {
  rolls: Swerve
  title: string
  rollType: string
}

export default function DiceRoller() {
  const initialSwerve: Swerve = { result: 0, positiveRolls: [], negativeRolls: [], positive: null, negative: null, boxcars: false }
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ rolls: initialSwerve, title: "", rollType: "" })
  const { open, saving, disabled, formData } = formState
  const { rolls, title, rollType } = formData as { rolls: Swerve; title: string; rollType: string }

  const showExplodingRoll = (): void => {
    const rolls = DS.rollSwerve()
    dispatchForm({ type: FormActions.UPDATE, name: "rollType", value: "Swerve" })
    dispatchForm({ type: FormActions.UPDATE, name: "rolls", value: rolls })
    dispatchForm({ type: FormActions.UPDATE, name: "title", value: "Swerve" })
    dispatchForm({ type: FormActions.OPEN, payload: true })
  }

  const showSingleRoll = (): void => {
    const sum = DS.rollDie()
    dispatchForm({ type: FormActions.UPDATE, name: "rollType", value: "Single Roll" })
    dispatchForm({ type: FormActions.UPDATE, name: "title", value: "Single Die Roll" })
    dispatchForm({ type: FormActions.UPDATE, name: "rolls", value: { ...rolls, result: sum } })
    dispatchForm({ type: FormActions.OPEN, payload: true })
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
      <StyledDialog open={open} onClose={() => dispatchForm({ type: FormActions.OPEN, payload: false })} title={title}>
        <DialogContent>
          <Box p={4}>
            <Stack spacing={1}>
              { rolls.boxcars && <Typography variant="h4">Boxcars!</Typography> }
              { rollType === "Swerve" && <>
                <Stack direction="row" spacing={1}>
                  { rolls.positiveRolls?.map((roll, index) => <Avatar key={"positive" + index} sx={{ backgroundColor: "red", color: "black", width: 40, height: 40 }} variant="rounded">{roll}</Avatar>) }
                </Stack>
                <Stack direction="row" spacing={1}>
                  { rolls.negativeRolls?.map((roll, index) => <Avatar key={"negative" + index} sx={{ backgroundColor: "white", color: "black", width: 40, height: 40 }} variant="rounded">{roll}</Avatar>) }
                </Stack>
              </> }
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
