import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Faction, User } from "@/types/types"
import { defaultFaction } from "@/types/types"
import Client from "@/utils/Client"
import { useState, useEffect } from "react"
import { RichTextRenderer } from "@/components/editor"
import FactionAvatar from "@/components/avatars/FactionAvatar"

interface FactionPopupProps {
  mentionId: string
  mentionClass: string
  user: User | null // Allow user to be nullable
  client: Client
}

export default function FactionPopup({
  user,
  client,
  mentionId,
  mentionClass,
}: FactionPopupProps) {
  const [faction, setFaction] = useState<Faction>(defaultFaction)

  useEffect(() => {
    const fetchFaction = async () => {
      try {
        const fetchedFaction = await client.getFaction({ id: mentionId })
        console.log("Fetched faction:", fetchedFaction)
        if (fetchedFaction) {
          setFaction(fetchedFaction)
        } else {
          console.error(`Faction with ID ${mentionId} not found`)
        }
      } catch (error) {
        console.error("Error fetching faction:", error)
      }
    }

    if (user?.id && mentionId) {
      fetchFaction().catch((error) => {
        console.error("Failed to fetch faction:", error)
      })
    }
  }, [user, mentionId, client])

  if (!user?.id) {
    return null // Use null instead of <></> for consistency
  }

  const subhead = [
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
        <FactionAvatar faction={faction} />
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
