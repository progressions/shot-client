import { useState } from 'react'
import { Box, Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import VehicleModal from '@/components/vehicles/VehicleModal'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'

import type { Character, Vehicle, Fight, Toast, ID } from "@/types/types"
import { defaultVehicle } from "@/types/types"

export default function CreateVehicle() {
  const [newVehicle, setNewVehicle] = useState<Vehicle>(defaultVehicle)

  const openModal = (): void => {
    setNewVehicle({...defaultVehicle, new: true})
  }

  return (
    <>
      <Button variant="contained" color="primary" startIcon={<DirectionsCarFilledIcon />} onClick={openModal}>
        New
      </Button>
      <VehicleModal open={newVehicle} setOpen={setNewVehicle} character={newVehicle} />
    </>
  )
}
