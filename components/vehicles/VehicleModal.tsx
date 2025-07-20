import { useReducer, useState, useEffect } from 'react'
import { Switch, DialogActions, DialogContent, FormControlLabel, InputAdornment, Stack, Button, Paper, Popover } from '@mui/material'
import CommuteIcon from '@mui/icons-material/Commute'
import CarCrashIcon from '@mui/icons-material/CarCrash'
import ColorPicker from "@/components/characters/edit/ColorPicker"

import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import CharacterType from '@/components/characters/edit/CharacterType'

import PositionSelector from "@/components/vehicles/PositionSelector"
import PursuerSelector from "@/components/vehicles/PursuerSelector"
import DriverSelector from "@/components/vehicles/DriverSelector"
import ArchetypeSelector from "@/components/vehicles/VehicleArchetypeSelector"

import { useToast, useFight, useClient } from "@/contexts"
import type { Character, Vehicle, Fight, VehicleArchetype } from "@/types/types"
import { defaultVehicle } from "@/types/types"
import { StyledTextField, SaveCancelButtons, StyledDialog } from "@/components/StyledFields"
import { FormActions, useForm } from '@/reducers/formState'
import { FightActions } from '@/reducers/fightState'
import VS from "@/services/VehicleService"

interface VehicleModalParams {
  character: Vehicle | null
  reload?: () => Promise<void>
}

type FormData = {
  character: Vehicle
}

export default function VehicleModal({ character:activeVehicle, reload }: VehicleModalParams) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ character: activeVehicle || defaultVehicle });
  const { open, saving, disabled, formData } = formState
  const { character }  = formData

  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { fight, dispatch:dispatchFight } = useFight()

  const newVehicle = !character.id

  useEffect(() => {
    if (activeVehicle?.id || activeVehicle?.new) {
      dispatchForm({ type: FormActions.UPDATE, name: "character", value: activeVehicle })
      dispatchForm({ type: FormActions.OPEN, payload: true })
    }
  }, [activeVehicle])

  function handleClose() {
    cancelForm()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: { ...character, [event.target.name]: event.target.value } })
  }

  const handleCheck = (event: React.SyntheticEvent<Element, Event>) => {
    const target = event.target as HTMLInputElement
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: { ...character, [target.name]: target.checked } })
  }

  const handleAVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCharacter = VS.updateActionValue(character, event.target.name, event.target.value)
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: updatedCharacter })
  }

  const handleDriverChange = (driver: Character) => {
    const updatedCharacter = VS.updateDriver(character, driver)
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: updatedCharacter })
  }

  const handleArchetypeChange = (archetype: VehicleArchetype) => {
    const updatedCharacter = VS.updateFromArchetype(character, archetype)
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: updatedCharacter })
  }

  const cancelForm = () => {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    try {
      const data = newVehicle ?
        await client.createVehicle(character, fight) :
        await client.updateVehicle(character, fight)

      dispatchForm({ type: FormActions.UPDATE, name: "character", value: data })
      cancelForm()
      if (newVehicle) {
        toastSuccess(`${character.name} created.`)
      } else {
        toastSuccess(`${character.name} updated.`)
      }
      if (fight?.id) {
        dispatchFight({ type: FightActions.EDIT })
      } else if (reload) {
        await reload()
      }
    } catch(error) {
      console.error(error)
      toastError()
    }
    cancelForm()
  }

  const setCharacter = (updatedCharacter: Vehicle) => {
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: updatedCharacter })
  }

  const woundsLabel = VS.isType(character, "Mook") ? "Mooks" : "Chase"
  const dialogTitle = newVehicle ? "Create Vehicle" : "Update Vehicle"

  return (
    <>
      <StyledDialog
        open={open}
        onClose={handleClose}
        title={dialogTitle}
        onSubmit={handleSubmit}
      >
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <ArchetypeSelector vehicle={character} onChange={handleArchetypeChange} />
              <FormControlLabel label="Task" name="task" control={<Switch checked={!!character.task} />} onChange={handleCheck} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <StyledTextField
                autoFocus
                label="Name"
                variant="filled"
                size="medium"
                sx={{paddingBottom: 2}}
                fullWidth
                required
                name="name"
                value={character.name}
                onChange={handleChange}
              />
            </Stack>
            <Stack spacing={2} direction="row" alignItems='center'>
              <PlayerTypeOnly character={character} except="Mook">
                <StyledTextField label={woundsLabel} type="number" name="Chase Points" value={character.action_values?.['Chase Points'] || ''} onChange={handleAVChange}
                  InputProps={{startAdornment: <InputAdornment position="start"><CommuteIcon color='error' /></InputAdornment>}} />
                <StyledTextField label="Condition" type="number" name="Condition Points" value={character.action_values?.['Condition Points'] || ''} onChange={handleAVChange}
                  InputProps={{startAdornment: <InputAdornment position="start"><CarCrashIcon color='error' /></InputAdornment>}} />
              </PlayerTypeOnly>
              <PlayerTypeOnly character={character} only="Mook">
                <StyledTextField label={woundsLabel} type="number" name="count" value={character.count || ""} onChange={handleChange}
                  InputProps={{startAdornment: <InputAdornment position="start"><CommuteIcon color='error' /></InputAdornment>}} />
              </PlayerTypeOnly>
              <StyledTextField label="Impairments" type="number" name="impairments" value={character.impairments || ''} onChange={handleChange} />
              <ColorPicker character={character} onChange={handleChange} setCharacter={setCharacter} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <StyledTextField label="Acceleration" type="number" sx={{width: 100}} name="Acceleration" value={character.action_values?.['Acceleration'] || ''} onChange={handleAVChange} />
              <StyledTextField label="Handling" type="number" sx={{width: 100}} name="Handling" value={character.action_values?.['Handling'] || ''} onChange={handleAVChange} />
              <StyledTextField label="Squeal" type="number" sx={{width: 100}} name="Squeal" value={character.action_values?.['Squeal'] || ''} onChange={handleAVChange} />
              <StyledTextField label="Frame" type="number" sx={{width: 100}} name="Frame" value={character.action_values?.['Frame'] || ''} onChange={handleAVChange} />
              <StyledTextField label="Crunch" type="number" sx={{width: 100}} name="Crunch" value={character.action_values?.['Crunch'] || ''} onChange={handleAVChange} />
            </Stack>
            { character?.id && <DriverSelector vehicle={character} onChange={handleDriverChange} /> }
            <Stack direction="row" spacing={2}>
              <PositionSelector character={character} onChange={handleAVChange} />
              <PursuerSelector character={character} onChange={handleAVChange} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <SaveCancelButtons disabled={saving} onCancel={cancelForm} />
        </DialogActions>
      </StyledDialog>
    </>
  )
}
