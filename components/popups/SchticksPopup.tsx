import { Link, Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Schtick, Character, User } from "@/types/types"
import { DescriptionKeys as D, defaultCharacter } from "@/types/types"
import { useState, useEffect } from "react"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"
import CS from "@/services/CharacterService"
import GamemasterOnly from "@/components/GamemasterOnly"
import { RichTextRenderer } from "@/components/editor"
import ReactDOMServer from "react-dom/server"
import { useClient } from "@/contexts"

interface SchticksPopupProps {
  id: string
}

export default function SchticksPopup({
  id,
}: SchticksPopupProps) {
  const { user, client } = useClient()
  const [character, setCharacter] = useState<Character>(defaultCharacter)
  const schticks = character.schticks || []

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const fetchedCharacter = await client.getCharacter({ id })
        console.log("Fetched character:", fetchedCharacter)
        if (fetchedCharacter) {
          setCharacter(fetchedCharacter)
        } else {
          console.error(`Character with ID ${id} not found`)
        }
      } catch (error) {
        console.error("Error fetching character:", error)
      }
    }

    if (user?.id && id) {
      fetchCharacter().catch((error) => {
        console.error("Failed to fetch character:", error)
      })
    }
  }, [user, id, client])

  if (!user?.id) {
    return null // Use null instead of <></> for consistency
  }

  if (!character?.id) {
    return (
      <Typography variant="body2">
        Loading...
      </Typography>
    )
  }

  return (
    <>
      <Typography variant="h5">{character.name}&rsquo;s Schticks</Typography>
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
