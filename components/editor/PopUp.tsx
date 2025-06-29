import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Character, User } from "@/types/types"
import { defaultCharacter } from "@/types/types"
import Client from "@/utils/Client"
import { useState, useEffect } from "react"
import CharacterAvatar from "@/components/characters/CharacterAvatar"

interface PopUpProps {
  mentionId: string
  mentionClass: string
  user: User
  client: Client
}

export default function PopUp({ user, client, mentionId, mentionClass }: PopUpProps) {
  const [character, setCharacter] = useState<Character>(defaultCharacter)

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const fetchedCharacter = await client.getCharacter({ id: mentionId })
        console.log("Fetched character:", fetchedCharacter)
        if (fetchedCharacter) {
          setCharacter(fetchedCharacter)
        } else {
          console.error(`Character with ID ${mentionId} not found`)
        }
      } catch (error) {
        console.error('Error fetching character:', error)
      }
    }

    if (user?.id && mentionId) {
      fetchCharacter()
    }
  }, [])

  if (!user?.id) {
    return <></>
  }

  return (
    <Box className={styles.mentionPopUp}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <CharacterAvatar character={character} />
        <Typography>{character.name}</Typography>
      </Stack>
    </Box>
  )
}
