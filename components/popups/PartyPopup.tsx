import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { PopupProps, Party, User } from "@/types/types"
import { defaultParty } from "@/types/types"
import { useState, useEffect } from "react"
import { RichTextRenderer } from "@/components/editor"
import PartyAvatar from "@/components/avatars/PartyAvatar"
import { useClient } from "@/contexts"

export default function PartyPopup({
  id, data
}: PopupProps) {
  const { user, client } = useClient()
  const [party, setParty] = useState<Party>(defaultParty)

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const fetchedParty = await client.getParty({ id })
        console.log("Fetched party:", fetchedParty)
        if (fetchedParty) {
          setParty(fetchedParty)
        } else {
          console.error(`Party with ID ${id} not found`)
        }
      } catch (error) {
        console.error("Error fetching party:", error)
      }
    }

    if (user?.id && id) {
      fetchParty().catch((error) => {
        console.error("Failed to fetch party:", error)
      })
    }
  }, [user, id, client])

  if (!user?.id) {
    return null // Use null instead of <></> for consistency
  }

  const subhead = [
    party.faction?.name,
  ]
    .filter(Boolean)
    .join(" - ")

  if (!party?.id) {
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
        <PartyAvatar party={party} disablePopup={true} />
        <Typography>{party.name}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
        {subhead}
      </Typography>
      <Box mt={1}>
        <Typography variant="body2">
          <RichTextRenderer key={party.description} html={party.description} />
        </Typography>
      </Box>
    </Box>
  )
}

