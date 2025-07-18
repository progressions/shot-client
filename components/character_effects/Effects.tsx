import { Link, Stack, Alert, Tooltip, IconButton, Popover, AlertTitle, Box, Typography } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"
import GamemasterOnly from "@/components/GamemasterOnly"

import { useMemo, useState } from "react"

import type { Severity, CharacterEffect, Character } from "@/types/types"
import { FightActions } from "@/reducers/fightState"

interface EffectsProps {
  character: Character
  effects: CharacterEffect[]
  severity: Severity
}

export default function Effects({ character, effects, severity }: EffectsProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const { fight, dispatch } = useFight()
  const { user, client } = useClient()
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

  return (<>
    <Link
      data-mention-id={`effects-${severity}-${character.id}`}
      data-mention-class-name="CharacterEffects"
      data-mention-data={JSON.stringify({ severity, effects })}
    >
      <IconButton onMouseEnter={showEffect} color={severity}>
        <InfoOutlinedIcon />
      </IconButton>
    </Link>
  </>)

  return (
    <>
      <Tooltip title={`${effects.length} effects`}>
        <IconButton onMouseEnter={showEffect} color={severity}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
      </Popover>
    </>
  )
}
