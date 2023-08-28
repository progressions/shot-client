import { Stack, Alert, Tooltip, IconButton, Popover, AlertTitle, Box, Typography } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"

import { useMemo, useState } from "react"

import type { Severity, CharacterEffect, Character } from "@/types/types"
import { FightActions } from "@/reducers/fightState"

interface EffectsProps {
  effects: CharacterEffect[]
  severity: Severity
}

export default function Effects({ effects, severity }: EffectsProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const { fight, dispatch } = useFight()
  const { jwt, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const closePopover = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  const showEffect = (event: React.SyntheticEvent<Element, Event>) => {
    setAnchorEl(event.target as Element)
    setOpen(true)
  }

  const deleteEffect = async (effect: CharacterEffect) => {
    try {
      await client.deleteCharacterEffect(effect, fight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`Effect ${effect.name} deleted.`)
    } catch(error) {
      toastError()
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
        <Alert severity={severity as Severity}>
          {
            effects.map((effect: CharacterEffect) => (<Box key={effect.id}>
              <Stack direction="row" spacing={2}>
                <AlertTitle>
                  <Box sx={{width: 100}}>{effect.name}</Box>
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
