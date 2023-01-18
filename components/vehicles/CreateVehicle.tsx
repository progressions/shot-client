import { useState } from 'react'
import { Box, Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import VehicleModal from './VehicleModal'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'

import type { Character, Vehicle, Fight, Toast, ID } from "../../types/types"
import { defaultVehicle } from "../../types/types"

interface CreateVehicleParams {
  fight?: Fight,
  setFight?: React.Dispatch<React.SetStateAction<Fight>>
}

export default function CreateVehicle({ fight, setFight }: CreateVehicleParams) {
  const [newVehicle, setNewVehicle] = useState<Vehicle>(defaultVehicle)

  const openModal = (): void => {
    setNewVehicle({...defaultVehicle, new: true})
  }

  return (
    <>
      <Button variant="outlined" color="primary" startIcon={<DirectionsCarFilledIcon />} onClick={openModal}>
        New
      </Button>
      <VehicleModal open={newVehicle} setOpen={setNewVehicle} fight={fight} character={newVehicle} setFight={setFight} />
    </>
  )
}
