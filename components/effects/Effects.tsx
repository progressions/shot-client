import { Button, Tooltip, Alert, AlertTitle, Popover, Box, Stack, Typography, IconButton } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useSession } from 'next-auth/react'
import { useFight } from "../../contexts/FightContext"
import Client from "../Client"
import type { FightContextType } from "../../contexts/FightContext"

import type { Effect, Severity } from "../../types/types"

interface EffectsProps {
  effects: Effect[]
  severity: Severity
}

export default function Effects({ effects, severity }: EffectsProps) {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const { fight, setFight, reloadFight } = useFight()
  const { client } = useClient()
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
    const response = await client.deleteEffect(effect, fight)
    if (response.status === 200) {
      await reloadFight(fight)
      toastSuccess(`Effect ${effect.title} deleted.`)
    } else {
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
                {effect.title}
              </AlertTitle>
              <Box mt={-1} pb={1}>
                <Typography>{effect.description}</Typography>
                <Typography variant="caption">Until sequence {effect.end_sequence}, shot {effect.end_shot}</Typography>
                <IconButton onClick={async () => await deleteEffect(effect)}><DeleteIcon sx={{color: toolbarColor}} /></IconButton>
              </Box>
            </Box>))
          }
        </Alert>
      </Popover>
    </>
  )
}
