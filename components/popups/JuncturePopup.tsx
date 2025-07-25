import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { PopupProps, Juncture, User } from "@/types/types"
import { defaultJuncture } from "@/types/types"
import { useState, useEffect } from "react"
import { RichTextRenderer } from "@/components/editor"
import JunctureAvatar from "@/components/avatars/JunctureAvatar"
import { useClient } from "@/contexts"

export default function JuncturePopup({
  id, data
}: PopupProps) {
  const { user, client } = useClient()
  const [juncture, setJuncture] = useState<Juncture>(defaultJuncture)

  useEffect(() => {
    const fetchJuncture = async () => {
      try {
        const fetchedJuncture = await client.getJuncture({ id })
        console.log("Fetched juncture:", fetchedJuncture)
        if (fetchedJuncture) {
          setJuncture(fetchedJuncture)
        } else {
          console.error(`Juncture with ID ${id} not found`)
        }
      } catch (error) {
        console.error("Error fetching juncture:", error)
      }
    }

    if (user?.id && id) {
      fetchJuncture().catch((error) => {
        console.error("Failed to fetch juncture:", error)
      })
    }
  }, [user, id, client])

  if (!user?.id) {
    return null // Use null instead of <></> for consistency
  }

  const subhead = [
    "Juncture",
    juncture.faction?.name,
  ]
    .filter(Boolean)
    .join(" - ")

  if (!juncture?.id) {
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
        <JunctureAvatar juncture={juncture} disablePopup={true} />
        <Typography>{juncture.name}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
        {subhead}
      </Typography>
      <Box mt={1}>
        <Typography variant="body2">
          <RichTextRenderer key={juncture.description} html={juncture.description} />
        </Typography>
      </Box>
    </Box>
  )
}
