import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Schtick, User } from "@/types/types"
import { defaultSchtick } from "@/types/types"
import Client from "@/utils/Client"
import { useState, useEffect } from "react"
import { RichTextRenderer } from "@/components/editor"

interface SchtickPopupProps {
  mentionId: string
  mentionClass: string
  user: User | null // Allow user to be nullable
  client: Client
}

export default function SchtickPopup({
  user,
  client,
  mentionId,
  mentionClass,
}: SchtickPopupProps) {
  const [schtick, setSchtick] = useState<Schtick>(defaultSchtick)

  useEffect(() => {
    const fetchSchtick = async () => {
      try {
        const fetchedSchtick = await client.getSchtick({ id: mentionId })
        console.log("Fetched schtick:", fetchedSchtick)
        if (fetchedSchtick) {
          setSchtick(fetchedSchtick)
        } else {
          console.error(`Schtick with ID ${mentionId} not found`)
        }
      } catch (error) {
        console.error("Error fetching schtick:", error)
      }
    }

    if (user?.id && mentionId) {
      fetchSchtick().catch((error) => {
        console.error("Failed to fetch schtick:", error)
      })
    }
  }, [user, mentionId, client])

  if (!user?.id) {
    return null // Use null instead of <></> for consistency
  }

  const subhead = [
    schtick.category,
    schtick.path
  ]
    .filter(Boolean)
    .join(" - ")

  if (!schtick?.id) {
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
        <Typography>{schtick.name}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
        {subhead}
      </Typography>
      <Box mt={1}>
        <Typography variant="body2">
          <RichTextRenderer key={schtick.description} html={schtick.description} />
        </Typography>
      </Box>
    </Box>
  )
}
