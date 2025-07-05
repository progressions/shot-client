import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { Link, colors, Stack, Typography, Box, Popover, Tooltip, IconButton } from "@mui/material"
import { useState } from "react"
import type { Character, Schtick } from "@/types/types"

interface SchticksDisplayProps {
  character: Character
  first?: boolean
}

export default function SchticksDisplay({ character, first }: SchticksDisplayProps) {
  const schticks = character.schticks || []

  if (!schticks.length) return <></>

  const schticksList = schticks.map((schtick: Schtick) => schtick.name).join(', ').substring(0, 400)

  return (
    <>
      { first &&
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start">
          <Link data-mention-id={character.id} data-mention-class-name="Schticks" sx={{color: "white"}}>
            <IconButton color="inherit">
              <LightbulbIcon />
            </IconButton>
          </Link>
          <Typography gutterBottom>
            { schticksList }{ schticksList.length > 399 ? '...' : ''}
          </Typography>
        </Stack>
      }
      { !first &&
        <Link data-mention-id={character.id} data-mention-class-name="Schticks" sx={{color: "white"}}>
          <IconButton color="inherit">
            <LightbulbIcon />
          </IconButton>
        </Link>
      }
    </>
  )
}
