import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Weapon, User } from "@/types/types"
import { defaultWeapon } from "@/types/types"
import { useState, useEffect } from "react"
import { RichTextRenderer } from "@/components/editor"
import WeaponAvatar from "@/components/avatars/WeaponAvatar"
import { useClient } from "@/contexts"

interface WeaponPopupProps {
  id: string
}

export default function WeaponPopup({
  id
}: WeaponPopupProps) {
  const { user, client } = useClient()
  const [weapon, setWeapon] = useState<Weapon>(defaultWeapon)

  useEffect(() => {
    const fetchWeapon = async () => {
      try {
        const fetchedWeapon = await client.getWeapon({ id })
        console.log("Fetched weapon:", fetchedWeapon)
        if (fetchedWeapon) {
          setWeapon(fetchedWeapon)
        } else {
          console.error(`Weapon with ID ${id} not found`)
        }
      } catch (error) {
        console.error("Error fetching weapon:", error)
      }
    }

    if (user?.id && id) {
      fetchWeapon().catch((error) => {
        console.error("Failed to fetch weapon:", error)
      })
    }
  }, [user, id, client])

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

