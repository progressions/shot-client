import InfoIcon from '@mui/icons-material/Info'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSession } from 'next-auth/react'
import Client from "../Client"
import { loadFight } from '../fights/FightDetail'
import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"

import { useState } from "react"
import { Button, Tooltip, Alert, AlertTitle, Popover, Box, Stack, Typography, IconButton } from "@mui/material"
import GamemasterOnly from "../GamemasterOnly"

import type { Toast, Effect, Fight } from "../../types/types"

interface EffectDetailProps {
  effect: Effect
}

export default function EffectDetail({ effect }: EffectDetailProps) {
  const [fight, setFight] = useFight()

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt: jwt })

  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [timer, setTimer] = useState<any>(null)
  const { toast, setToast, closeToast } = useToast()

  const showEffect = (event: any) => {
    clearTimeout(timer)
    setOpen(true)
    setAnchorEl(event.target)
    setTimer(closeAfterTimeout)
  }

  const closeAfterTimeout = () => {
    return (setTimeout(() => {
      closePopover()
    }, 2500))
  }

  const closePopover = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  const deleteEffect = async (event: any) => {
    const response = await client.deleteEffect(effect, fight)
    if (response.status === 200) {
      await loadFight({jwt, id: fight.id as string, setFight})
      setToast({ open: true, message: `Effect ${effect.title} deleted.`, severity: "success" })
    }
  }

  const toolbarColor = `${effect.severity}.dark`

  return (
    <>
      <Tooltip title={effect.title}>
        <IconButton onMouseEnter={showEffect} color={effect.severity as any}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={effect.severity as any} sx={{paddingRight: 5}}>
          <AlertTitle>
            {effect.title}
          </AlertTitle>
          <Typography>{effect.description}</Typography>
          <Typography variant="caption">Until sequence {effect.end_sequence}, shot {effect.end_shot}</Typography>
        </Alert>
        <Stack alignItems="flex-end" sx={{backgroundColor: toolbarColor}}>
          <GamemasterOnly user={session?.data?.user}>
            <IconButton onClick={deleteEffect}><DeleteIcon sx={{color: "white"}} /></IconButton>
          </GamemasterOnly>
        </Stack>
      </Popover>
    </>
  )
}
