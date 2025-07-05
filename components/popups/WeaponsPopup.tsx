import { colors, Link, Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Weapon, Character, User } from "@/types/types"
import { DescriptionKeys as D, defaultCharacter } from "@/types/types"
import { useState, useEffect } from "react"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"
import CS from "@/services/CharacterService"
import WS from "@/services/WeaponService"
import ImageIcon from "@mui/icons-material/Image"
import GamemasterOnly from "@/components/GamemasterOnly"
import { RichTextRenderer } from "@/components/editor"
import ReactDOMServer from "react-dom/server"
import { useClient } from "@/contexts"
import { GiDeathSkull, GiShotgun, GiPistolGun } from "react-icons/gi"

interface WeaponsPopupProps {
  id: string
}

export default function WeaponsPopup({
  id,
}: WeaponsPopupProps) {
  const { user, client } = useClient()
  const [character, setCharacter] = useState<Character>(defaultCharacter)
  const weapons = character.weapons

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

  const description = CS.isPC(character) ? CS.melodramaticHook(character) : CS.description(character)

  const charType = CS.type(character) ? <Link href="/" data-mention-id={CS.type(character)} data-mention-class-name="Type">
      {CS.type(character)}
    </Link> : null
  const charArchetype = CS.archetype(character) ? <Link href="/" data-mention-id={CS.archetype(character)} data-mention-class-name="Archetype">
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
      <Typography variant="body2">
        Loading...
      </Typography>
    )
  }

  return (
    <>
      <Typography variant="h6">{character.name}&rsquo;s Weapons</Typography>
      <Box pt={2} sx={{width: 500}}>
          {
            weapons.map((weapon: Weapon, index: number) => (
              <Box key={weapon.name + index}>
                <Stack direction="row" spacing={1} alignItems="center">
                  { weapon.image_url && <ImageIcon sx={{color: "primary.dark"}} /> }
                  <Typography gutterBottom>
                    {WS.nameWithCategory(weapon)} {WS.stats(weapon)}
                  </Typography>
                    {
                      weapon.kachunk &&
                        <Typography sx={{color: "primary.dark"}}>
                            <GiShotgun />
                        </Typography>
                    }
                  {
                    weapon.mook_bonus === 1 &&
                    <>
                      <Typography sx={{color: "primary.dark"}}>
                        <GiDeathSkull />
                      </Typography>
                    </>
                  }
                  {
                    weapon.mook_bonus === 2 &&
                    <>
                      <Typography sx={{color: "primary.dark"}}>
                        <GiDeathSkull />
                        <GiDeathSkull />
                      </Typography>
                    </>
                  }
              </Stack>
                {
                  weapon.kachunk &&
                    <Typography gutterBottom sx={{marginTop: 0, marginLeft: 4, color: "primary.main"}} variant="subtitle2">
                      Damage Value is 14 if you spend a shot to go “KA-CHUNK!”
                    </Typography>
                }
                {
                  weapon.mook_bonus === 1 &&
                    <Typography gutterBottom sx={{marginTop: 0, marginLeft: 4, color: "primary.main"}} variant="subtitle2">
                      +1 Attack vs Mooks
                    </Typography>
                }
                {
                  weapon.mook_bonus === 2 &&
                    <Typography gutterBottom sx={{marginTop: 0, marginLeft: 4, color: "primary.main"}} variant="subtitle2">
                      +2 Attack vs Mooks
                    </Typography>
                }
              </Box>
            ))
          }
        </Box>
    </>
  )
}

