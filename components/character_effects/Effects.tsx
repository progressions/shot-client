import { Stack, Alert, Tooltip, IconButton, Popover, AlertTitle, Box, Typography } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"

import { useMemo, useState } from "react"

import type { CharacterEffect, Character } from "../../types/types"

export default function Effects({ effects, severity }: any) {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)

  const { fight, setFight, reloadFight } = useFight()
  const { jwt, client } = useClient()
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
    const response = await client.deleteCharacterEffect(effect, fight)
    if (response.status === 200) {
      await reloadFight(fight)
      setToast({ open: true, message: `Effect ${effect.title} deleted.`, severity: "success" })
    }
  }

  const toolbarColor = `${severity}.dark`

  const actionValueLabel = (effect: CharacterEffect) => {
    if (effect.action_value === "MainAttack") {
      return "Attack"
    } else {
      return effect.action_value
    }
  }

  return (
    <>
      <Tooltip title={`${effects.length} effects`}>
        <IconButton onMouseEnter={showEffect} color={severity}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={severity as any}>
          {
            effects.map((effect: any) => (<Box key={effect.id}>
              <Stack direction="row" spacing={2}>
                <AlertTitle>
                  <Box sx={{width: 100}}>{effect.title}</Box>
                </AlertTitle>
                <IconButton onClick={async () => await deleteEffect(effect)}><DeleteIcon sx={{marginTop: -1, color: toolbarColor}} /></IconButton>
              </Stack>
              <Box mt={-1} pb={1}>
                <Typography variant="caption">{effect.description}</Typography>
                <Typography variant="subtitle1">{actionValueLabel(effect)} {effect.change}</Typography>
              </Box>
            </Box>))
          }
        </Alert>
      </Popover>
    </>
  )
}
