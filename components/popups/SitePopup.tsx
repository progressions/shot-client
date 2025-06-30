import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Site, User } from "@/types/types"
import { defaultSite } from "@/types/types"
import Client from "@/utils/Client"
import { useState, useEffect } from "react"
import { RichTextRenderer } from "@/components/editor"
import SiteAvatar from "@/components/avatars/SiteAvatar"

interface SitePopupProps {
  mentionId: string
  mentionClass: string
  user: User | null // Allow user to be nullable
  client: Client
}

export default function SitePopup({
  user,
  client,
  mentionId,
  mentionClass,
}: SitePopupProps) {
  const [site, setSite] = useState<Site>(defaultSite)

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const fetchedSite = await client.getSite({ id: mentionId })
        console.log("Fetched site:", fetchedSite)
        if (fetchedSite) {
          setSite(fetchedSite)
        } else {
          console.error(`Site with ID ${mentionId} not found`)
        }
      } catch (error) {
        console.error("Error fetching site:", error)
      }
    }

    if (user?.id && mentionId) {
      fetchSite().catch((error) => {
        console.error("Failed to fetch site:", error)
      })
    }
  }, [user, mentionId, client])

  if (!user?.id) {
    return null // Use null instead of <></> for consistency
  }

  const subhead = [
    site.faction?.name,
  ]
    .filter(Boolean)
    .join(" - ")

  if (!site?.id) {
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
        <SiteAvatar site={site} />
        <Typography>{site.name}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
        {subhead}
      </Typography>
      <Box mt={1}>
        <Typography variant="body2">
          <RichTextRenderer key={site.description} html={site.description} />
        </Typography>
      </Box>
    </Box>
  )
}
