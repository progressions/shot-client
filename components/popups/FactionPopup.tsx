import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { PopupProps, Faction, User } from "@/types/types"
import { defaultFaction } from "@/types/types"
import { useState, useEffect } from "react"
import { RichTextRenderer } from "@/components/editor"
import FactionAvatar from "@/components/avatars/FactionAvatar"
import { useClient } from "@/contexts"

export default function FactionPopup({
  id, data
}: PopupProps) {
  const { user, client } = useClient()
  const [faction, setFaction] = useState<Faction>(defaultFaction)

  useEffect(() => {
    const fetchFaction = async () => {
      try {
        const fetchedFaction = await client.getFaction({ id })
        console.log("Fetched faction:", fetchedFaction)
        if (fetchedFaction) {
          setFaction(fetchedFaction)
        } else {
          console.error(`Faction with ID ${id} not found`)
        }
      } catch (error) {
        console.error("Error fetching faction:", error)
      }
    }

    if (user?.id && id) {
      fetchFaction().catch((error) => {
        console.error("Failed to fetch faction:", error)
      })
    }
  }, [user, id, client])

  if (!user?.id) {
    return null // Use null instead of <></> for consistency
  }

  const subhead = [
    "Faction"
  ]
    .filter(Boolean)
    .join(" - ")

  if (!faction?.id) {
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
        <FactionAvatar faction={faction} disablePopup={true} />
        <Typography>{faction.name}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
        {subhead}
      </Typography>
      <Box mt={1}>
        <Typography variant="body2">
          <RichTextRenderer key={faction.description} html={faction.description} />
        </Typography>
      </Box>
    </Box>
  )
}
