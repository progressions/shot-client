import { Button, Tooltip, Alert, AlertTitle, Popover, Box, Stack, Typography, IconButton } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import { useSession } from 'next-auth/react'
import { useFight } from "../../contexts/FightContext"
import Client from "../Client"
import type { FightContextType } from "../../contexts/FightContext"
import { loadFight } from '../fights/FightDetail'

export default function Effects({ effects, severity }: any) {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const [fight, setFight]:FightContextType = useFight()
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })
  const { setToast } = useToast()

  const closePopover = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  const showEffect = (event: any) => {
    setAnchorEl(event.target)
    setOpen(true)
  }

  const deleteEffect = async (effect: any) => {
    const response = await client.deleteEffect(effect, fight)
    if (response.status === 200) {
      await loadFight({jwt, id: fight.id as string, setFight})
      setToast({ open: true, message: `Effect ${effect.title} deleted.`, severity: "success" })
    }
  }

  const toolbarColor = `${severity}.dark`

  return (
    <>
      <Tooltip title={`${effects.length} effects`}>
        <IconButton onMouseEnter={showEffect} color={severity}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={severity as any} sx={{paddingRight: 5}}>
          {
            effects.map((effect: any) => (<Box key={effect.id}>
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
