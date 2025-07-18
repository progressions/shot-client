import { Link, Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { PopupProps, SkillValue, Character, User } from "@/types/types"
import { DescriptionKeys as D, defaultCharacter } from "@/types/types"
import { useState, useEffect } from "react"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"
import CS from "@/services/CharacterService"
import GamemasterOnly from "@/components/GamemasterOnly"
import { RichTextRenderer } from "@/components/editor"
import ReactDOMServer from "react-dom/server"
import { useClient } from "@/contexts"

export default function SkillsPopup({
  id, data
}: PopupProps) {
  const skillValues = data

  return (
    <>
      <Typography variant="h6">Skills</Typography>
      <Box pt={2}>
          {
            skillValues.map(([name, value]: SkillValue) => {
              return (
                <Typography key={name} gutterBottom>
                  <strong>{name}</strong>:
                  <Typography component="span">{value}</Typography>
                </Typography>
              )
            })
          }
        </Box>
    </>
  )
}
