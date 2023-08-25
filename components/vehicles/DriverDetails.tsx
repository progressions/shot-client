import type { Vehicle, Character } from "@/types/types"
import { Typography } from "@mui/material"

interface DriverDetailsProps {
  vehicle: Vehicle
}

export default function DriverDetails({ vehicle }: DriverDetailsProps) {
  const { driver } = vehicle

  if (!driver?.id) return null

  const driving = driver.skills["Driving"] || 7

  return (
    <Typography>Driven by {driver.name} (Driving {driving})</Typography>
  )
}
