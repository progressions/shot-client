import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Character, User } from "@/types/types"
import { defaultCharacter } from "@/types/types"
import Client from "@/utils/Client"
import { useState, useEffect } from "react"
import VehicleAvatar from "@/components/avatars/VehicleAvatar"
import VS from "@/services/VehicleService"
import GamemasterOnly from "@/components/GamemasterOnly"

interface VehiclePopupProps {
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
}: VehiclePopupProps) {
  const [vehicle, setVehicle] = useState<Character>(defaultCharacter)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const fetchedVehicle = await client.getVehicle({ id: mentionId })
        console.log("Fetched vehicle:", fetchedVehicle)
        if (fetchedVehicle) {
          setVehicle(fetchedVehicle)
        } else {
          console.error(`Vehicle with ID ${mentionId} not found`)
        }
      } catch (error) {
        console.error("Error fetching vehicle:", error)
      }
    }

    if (user?.id && mentionId) {
      fetchVehicle().catch((error) => {
        console.error("Failed to fetch vehicle:", error)
      })
    }
  }, [user, mentionId, client])

  if (!user?.id) {
    return null
  }

  const subhead = [
    VS.type(vehicle),
    VS.factionName(vehicle),
  ]
    .filter(Boolean)
    .join(" - ")

  if (!vehicle?.id) {
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
        <VehicleAvatar vehicle={vehicle} />
        <Typography>{vehicle.name}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
        {subhead}
      </Typography>
      <GamemasterOnly user={user}>
        <Box mt={1}>
          <Typography variant="body2">
            {VS.acceleration(vehicle) > 0 && (
              <>
                <strong>Acceleration</strong>{" "}
                {VS.acceleration(vehicle)}{" "}
              </>
            )}
            { VS.handling(vehicle) > 0 && (
                <>
                  <strong>Handling</strong>{" "}
                  {VS.handling(vehicle)}{" "}
                </>
              )}
            {VS.squeal(vehicle) > 0 && (
              <>
                <strong>Squeal</strong> {VS.squeal(vehicle)}{" "}
              </>
            )}
          </Typography>
          <Typography variant="body2">
            {VS.frame(vehicle) > 0 && (
              <>
                <strong>Frame</strong> {VS.frame(vehicle)}{" "}
              </>
            )}
            {VS.crunch(vehicle) > 0 && (
              <>
                <strong>Crunch</strong> {VS.crunch(vehicle)}{" "}
              </>
            )}
          </Typography>
        </Box>
      </GamemasterOnly>
    </Box>
  )
}
