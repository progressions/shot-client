import { Link, Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { PopupProps, Schtick, Character, User } from "@/types/types"
import { DescriptionKeys as D, defaultCharacter } from "@/types/types"
import { useState, useEffect } from "react"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"
import CS from "@/services/CharacterService"
import GamemasterOnly from "@/components/GamemasterOnly"
import { RichTextRenderer } from "@/components/editor"
import ReactDOMServer from "react-dom/server"
import { useClient } from "@/contexts"

export default function SchticksPopup({
  id, data
}: PopupProps) {
  const schticks = data

  return (
    <>
      <Typography variant="h5">Schticks</Typography>
      <Box pt={2} sx={{width: 500}}>
        {
          schticks.map((schtick: Schtick) => (
            <Typography key={schtick.id} gutterBottom>
              <Box component="span" sx={{color: schtick.color, fontWeight: "bold"}}>{schtick.name}</Box>: {schtick.description}
            </Typography>
          ))
        }
      </Box>
    </>
  )
}
