import { Link, Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { SkillValue, Character, User } from "@/types/types"
import { DescriptionKeys as D, defaultCharacter } from "@/types/types"
import { useState, useEffect } from "react"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"
import CS from "@/services/CharacterService"
import GamemasterOnly from "@/components/GamemasterOnly"
import { RichTextRenderer } from "@/components/editor"
import ReactDOMServer from "react-dom/server"
import { useClient } from "@/contexts"

interface CharacterPopupProps {
  id: string
}

export default function CharacterPopup({
  id,
}: CharacterPopupProps) {
  const { user, client } = useClient()
  const [character, setCharacter] = useState<Character>(defaultCharacter)
  const skillValues = CS.knownSkills(character)

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
    return null
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
      <Typography variant="h6">{character.name}&rsquo;s Skills</Typography>
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
