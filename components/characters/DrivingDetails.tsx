import type { Person, Vehicle, Character } from "@/types/types"
import { Typography } from "@mui/material"
import VS from "@/services/VehicleService"

interface DrivingDetailsProps {
  character: Person
}

export default function DrivingDetails({ character }: DrivingDetailsProps) {
  const { driving } = character

  if (!driving?.id) return null

  return (
    <Typography>Driving {driving.name} (Acceleration {VS.actionValue(driving, "Acceleration")})</Typography>
  )
}
