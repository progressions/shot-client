import { Link, Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Character, User } from "@/types/types"
import { DescriptionKeys as D, defaultCharacter } from "@/types/types"
import Client from "@/utils/Client"
import { useState, useEffect } from "react"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"
import CS from "@/services/CharacterService"
import GamemasterOnly from "@/components/GamemasterOnly"
import { RichTextRenderer } from "@/components/editor"
import ReactDOMServer from "react-dom/server"

interface CharacterPopupProps {
  mentionId: string
  mentionClass: string
  user: User | null // Allow user to be nullable
  client: Client
}

export default function CharacterPopup({
  user,
  client,
  mentionId,
  mentionClass,
}: CharacterPopupProps) {
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
        console.error("Error fetching character:", error)
      }
    }

    if (user?.id && mentionId) {
      fetchCharacter().catch((error) => {
        console.error("Failed to fetch character:", error)
      })
    }
  }, [user, mentionId, client])

  if (!user?.id) {
    return null // Use null instead of <></> for consistency
  }

  const description = CS.isPC(character) ? CS.melodramaticHook(character) : CS.description(character)

  const charType = CS.type(character) ? <Link data-mention-id={CS.type(character)} data-mention-class-name="Type">
      {CS.type(character)}
    </Link> : null
  const charArchetype = CS.archetype(character) ? <Link data-mention-id={CS.archetype(character)} data-mention-class-name="Archetype">
    {CS.archetype(character)}
  </Link> : null
  const factionName = CS.factionName(character) ? <Link href={`/factions/${character.faction_id}`} data-mention-id={character.faction_id} data-mention-class-name="Faction">
      {CS.factionName(character)}
    </Link> : null

  const subheadHtml = [
    charType ? ReactDOMServer.renderToStaticMarkup(charType) : null,
    charArchetype ? ReactDOMServer.renderToStaticMarkup(charArchetype) : null,
    factionName ? ReactDOMServer.renderToStaticMarkup(factionName) : null,
  ]
    .filter(Boolean)
    .join(" - ")

  if (!character?.id) {
    return (
      <Box className={styles.mentionPopup}>
        <Typography variant="body2">
          Loading...
        </Typography>
      </Box>
    )
  }
  return (
    <Box className={styles.mentionPopup}>
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <CharacterAvatar character={character} />
        <Typography>{character.name}</Typography>
      </Stack>
      <Typography variant="caption" className={styles.popupSubhead} sx={{ textTransform: "uppercase" }}>
        <RichTextRenderer html={subheadHtml} />
      </Typography>
      <Box mt={1}>
        { <RichTextRenderer html={description} /> }
      </Box>
      <GamemasterOnly user={user}>
        <Box mt={1}>
          <Typography variant="body2">
            {CS.mainAttack(character) && CS.mainAttackValue(character) > 0 && (
              <>
                <strong>{CS.mainAttack(character)}</strong>{" "}
                {CS.mainAttackValue(character)}{" "}
              </>
            )}
            {CS.secondaryAttack(character) &&
              CS.secondaryAttackValue(character) > 0 && (
                <>
                  <strong>{CS.secondaryAttack(character)}</strong>{" "}
                  {CS.secondaryAttackValue(character)}{" "}
                </>
              )}
            {CS.defense(character) > 0 && (
              <>
                <strong>Defense</strong> {CS.defense(character)}{" "}
              </>
            )}
          </Typography>
          <Typography variant="body2">
            {CS.toughness(character) > 0 && (
              <>
                <strong>Toughness</strong> {CS.toughness(character)}{" "}
              </>
            )}
            {CS.speed(character) > 0 && (
              <>
                <strong>Speed</strong> {CS.speed(character)}{" "}
              </>
            )}
            {CS.damage(character) > 0 && (
              <>
                <strong>Damage</strong> {CS.damage(character)}{" "}
              </>
            )}
          </Typography>
        </Box>
      </GamemasterOnly>
    </Box>
  )
}
