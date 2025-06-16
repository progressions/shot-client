import { Button, Tooltip, Alert, AlertTitle, Popover, Box, Stack, Typography, IconButton } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from "react"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"
import type { FightContextType } from "@/contexts/FightContext"
import GamemasterOnly from "@/components/GamemasterOnly"

import type { Effect, Severity } from "@/types/types"
import { FightActions } from "@/reducers/fightState"

interface EffectsProps {
  effects: Effect[]
  severity: Severity
}

export default function Effects({ effects, severity }: EffectsProps) {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const { fight, dispatch } = useFight()
  const { user, client } = useClient()
  const { toastError, toastSuccess } = useToast()

  const closePopover = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  const showEffect = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    setAnchorEl(event.target as Element)
    setOpen(true)
  }

  const deleteEffect = async (effect: Effect) => {
    try {
      await client.deleteEffect(effect, fight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`Effect ${effect.name} deleted.`)
    } catch(error) {
      toastError()
    }
  }

  const toolbarColor: string = `${severity}.dark`

  return (
    <>
      <Tooltip title={`${effects.length} effects`}>
        <IconButton onMouseEnter={showEffect} color={severity}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={severity as Severity} sx={{paddingRight: 5}}>
          {
            effects.map((effect: Effect) => (<Box key={effect.id}>
              <AlertTitle>
                {effect.name}
              </AlertTitle>
              <Box mt={-1} pb={1}>
                <Typography>{effect.description}</Typography>
                <Typography variant="caption">Until sequence {effect.end_sequence}, shot {effect.end_shot}</Typography>
                <GamemasterOnly user={user}>
                  <IconButton onClick={async () => await deleteEffect(effect)}><DeleteIcon sx={{color: toolbarColor}} /></IconButton>
                </GamemasterOnly>
              </Box>
            </Box>))
          }
        </Alert>
      </Popover>
    </>
  )
}
