import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { useVehicle } from "../../../contexts/VehicleContext"

import EditActionValues from "./EditActionValues"
import Faction from "../../characters/edit/Faction"
import CharacterType from "../../characters/edit/CharacterType"
import ColorPicker from "../../characters/edit/ColorPicker"

import { useEffect } from "react"

import { colors, Typography, Box, Stack, TextField, FormControlLabel, Switch, Button, InputAdornment } from "@mui/material"
import CommuteIcon from '@mui/icons-material/Commute'
import CarCrashIcon from '@mui/icons-material/CarCrash'

import PlayerTypeOnly from "../../PlayerTypeOnly"
import { Subhead, StyledTextField } from "../../StyledFields"

import type { Vehicle } from "../../../types/types"
import { VehicleActions } from "../../../reducers/vehicleState"

interface EditVehicleProps {
  vehicle: Vehicle
}

export default function EditVehicle({ vehicle:initialVehicle }: EditVehicleProps) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { state:vehicleState, dispatch:dispatchVehicle, updateVehicle } = useVehicle()

  const { edited, saving, vehicle } = vehicleState
  const { weapons, schticks, skills, description, action_values } = vehicle

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    event.preventDefault()

    await updateVehicle()
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    dispatchVehicle({ type: VehicleActions.UPDATE, name: event.target.name, value: event.target.value || event.target.checked })
  }

  function handleCheck(event: React.SyntheticEvent<Element, Event>, checked: boolean): void {
    const target = event.target as HTMLInputElement
    dispatchVehicle({ type: VehicleActions.UPDATE, name: target.name, value: checked })
  }

  function handleAVChange(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    dispatchVehicle({ type: VehicleActions.ACTION_VALUE, name: event.target.name, value: event.target.value || newValue })
  }

  function handleSkillsChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchVehicle({ type: VehicleActions.SKILLS, name: event.target.name, value: event.target.value })
  }

  function handleDescriptionChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchVehicle({ type: VehicleActions.DESCRIPTION, name: event.target.name, value: event.target.value })
  }

  async function cancelForm() {
    try {
      const data = await client.getVehicle(vehicle)
      dispatchVehicle({ type: VehicleActions.VEHICLE, payload: data })
      toastSuccess("Changes reverted.")
    } catch(error) {
      toastError()
    }
  }

  const woundsLabel = vehicle.action_values["Type"] === "Mook" ? "Mooks" : "Chase Points"

  const woundsAdornment = () => {
    if (vehicle.action_values["Type"] === "Mook") {
      return (
        <InputAdornment position="start"><CarCrashIcon color='error' /></InputAdornment>
      )
    }
    return (
      <InputAdornment position="start"><CommuteIcon color='error' /></InputAdornment>
    )
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <StyledTextField name="name" label="Name" required autoFocus fullWidth onChange={handleChange} value={vehicle.name} />
            <Faction faction={vehicle.faction} onChange={handleAVChange} />
            <FormControlLabel label="Active" name="active" control={<Switch checked={vehicle.active} />} onChange={handleCheck} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <CharacterType value={action_values.Type as string} onChange={handleAVChange} />
          </Stack>
          <Stack spacing={2} direction="row" alignItems='center'>
            <StyledTextField label={woundsLabel}
              type="number"
              name="Chase Points"
              value={vehicle.action_values?.['Chase Points'] || ''}
              onChange={handleAVChange as React.ChangeEventHandler}
              InputProps={
                {startAdornment: woundsAdornment()}
              }
            />
            { vehicle.action_values["Type"] != "Mook" &&
              <StyledTextField label="Condition Points"
                type="number"
                name="Condition Points"
                value={vehicle.action_values?.['Condition Points'] || ''}
                onChange={handleAVChange as React.ChangeEventHandler}
                InputProps={
                  {startAdornment: <InputAdornment position="start"><CarCrashIcon color='error' /></InputAdornment>}
                }
              />
            }
            <StyledTextField label="Impairments" type="number" name="impairments" value={vehicle.impairments || ''} onChange={handleChange} />
            <ColorPicker character={vehicle} onChange={handleChange} dispatch={dispatchVehicle} />
          </Stack>
          <EditActionValues vehicle={vehicle} onChange={handleAVChange as React.ChangeEventHandler} />
        </Stack>
      </Box>
    </>
  )
}