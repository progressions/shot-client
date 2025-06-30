import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Weapon, User } from "@/types/types"
import { defaultWeapon } from "@/types/types"
import Client from "@/utils/Client"
import { useState, useEffect } from "react"
import { RichTextRenderer } from "@/components/editor"
import WeaponAvatar from "@/components/avatars/WeaponAvatar"

interface WeaponPopupProps {
  mentionId: string
  mentionClass: string
  user: User | null // Allow user to be nullable
  client: Client
}

export default function WeaponPopup({
  user,
  client,
  mentionId,
  mentionClass,
}: WeaponPopupProps) {
  const [weapon, setWeapon] = useState<Weapon>(defaultWeapon)

  useEffect(() => {
    const fetchWeapon = async () => {
      try {
        const fetchedWeapon = await client.getWeapon({ id: mentionId })
        console.log("Fetched weapon:", fetchedWeapon)
        if (fetchedWeapon) {
          setWeapon(fetchedWeapon)
        } else {
          console.error(`Weapon with ID ${mentionId} not found`)
        }
      } catch (error) {
        console.error("Error fetching weapon:", error)
      }
    }

    if (user?.id && mentionId) {
      fetchWeapon().catch((error) => {
        console.error("Failed to fetch weapon:", error)
      })
    }
  }, [user, mentionId, client])

  if (!user?.id) {
    return null // Use null instead of <></> for consistency
  }

  const subhead = [
    weapon.juncture,
    weapon.category,
  ]
    .filter(Boolean)
    .join(" - ")

  if (!weapon?.id) {
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
        <WeaponAvatar weapon={weapon} />
        <Typography>{weapon.name}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
        {subhead}
      </Typography>
      <Box mt={1}>
        <Typography variant="body2">
          <RichTextRenderer key={weapon.description} html={weapon.description} />
        </Typography>
      </Box>
    </Box>
  )
}

