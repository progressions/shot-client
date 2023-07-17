import { useState, useEffect } from 'react'
import { Switch, DialogActions, DialogContent, FormControlLabel, InputAdornment, Stack, Button, Paper, Popover } from '@mui/material'
import CommuteIcon from '@mui/icons-material/Commute'
import CarCrashIcon from '@mui/icons-material/CarCrash'
import { BlockPicker, ColorResult } from 'react-color'

import PlayerTypeOnly from "../PlayerTypeOnly"
import CharacterType from '../characters/edit/CharacterType'

import PositionSelector from "./PositionSelector"
import PursuerSelector from "./PursuerSelector"
import DriverSelector from "./DriverSelector"

import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import type { Character, Vehicle, Fight } from "../../types/types"
import { defaultVehicle } from "../../types/types"
import { StyledTextField, SaveCancelButtons, StyledDialog } from "../StyledFields"
import { FightActions } from '../../reducers/fightState'

interface VehicleModalParams {
  open: Vehicle,
  setOpen: React.Dispatch<React.SetStateAction<Vehicle>>
  fight?: Fight,
  character: Vehicle | null
  reload?: () => Promise<void>
}

export default function VehicleModal({ open, setOpen, character:activeVehicle, reload }: VehicleModalParams) {
  const [picker, setPicker] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { fight, dispatch:dispatchFight } = useFight()

  const [saving, setSaving] = useState(false);

  const [character, setCharacter] = useState<Vehicle>(activeVehicle || defaultVehicle)

  const newVehicle = !character.id

  useEffect(() => {
    if (activeVehicle) {
      setCharacter(activeVehicle)
    }
  }, [activeVehicle])

  function handleClose() {
    cancelForm()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacter((prevState: Vehicle) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const handleCheck = (event: React.SyntheticEvent<Element, Event>) => {
    const target = event.target as HTMLInputElement
    setCharacter((prevState: Vehicle) => ({ ...prevState, [target.name]: target.checked }))
  }

  const handleAVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { action_values } = character || {}
    setCharacter((prevState: Vehicle) => ({ ...prevState, action_values: { ...action_values, [event.target.name]: event.target.value } }))
  }

  const handleDriverChange = (driver: Character) => {
    if (!driver?.id) {
      setCharacter((prevState: Vehicle) => ({ ...prevState, driver: { id: "" } as Character }))
    } else {
      setCharacter((prevState: Vehicle) => ({ ...prevState, driver: driver as Character }))
    }
  }

  const handleColor = (color: ColorResult) => {
    setCharacter((prevState: Vehicle) => ({ ...prevState, color: color?.hex }))
    setPicker(false)
    setAnchorEl(null)
  }

  const cancelForm = () => {
    setCharacter(character || defaultVehicle)
    setOpen(defaultVehicle)
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    setSaving(true)
    event.preventDefault()

    try {
      const data = newVehicle ?
        await client.createVehicle(character, fight) :
        await client.updateVehicle(character, fight)

      setCharacter(data)
      setSaving(false)
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
      setSaving(false)
      cancelForm()
    }
  }

  const togglePicker = (event: React.MouseEvent<HTMLElement>) => {
    if (picker) {
      setPicker(false)
      setAnchorEl(null)
    } else {
      setPicker(true)
      setAnchorEl(event.target as Element)
    }
  }

  const woundsLabel = character.action_values["Type"] === "Mook" ? "Mooks" : "Chase"
  const dialogTitle = newVehicle ? "Create Vehicle" : "Update Vehicle"

  return (
    <>
      <StyledDialog
        open={!!(open.id || open.new) && open.category === "vehicle"}
        onClose={handleClose}
        title={dialogTitle}
        onSubmit={handleSubmit}
      >
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <CharacterType value={character.action_values?.['Type'] as string || ''} onChange={handleAVChange} />
              <FormControlLabel label="Active" name="active" control={<Switch checked={character.active} />} onChange={handleCheck} />
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
              { fight?.id &&
              <StyledTextField label="Shot" type="number" name="current_shot" value={character.current_shot === null ? '' : character.current_shot} onChange={handleChange} sx={{width: 80}} /> }
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
              <Button sx={{width: 2, height: 50, bgcolor: character.color, borderColor: 'primary', border: 1, borderRadius: 2}} onClick={togglePicker} />
              <StyledTextField id="colorPicker" label="Color" name="color" value={character.color || ''} onChange={handleChange} />
            </Stack>
            <Popover anchorEl={anchorEl} open={picker} onClose={() => setPicker(false)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
              <Paper>
                <BlockPicker color={character.color || ''} onChangeComplete={handleColor} colors={['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']} />
              </Paper>
            </Popover>
            <Stack direction="row" spacing={2}>
              <StyledTextField label="Acceleration" type="number" sx={{width: 100}} name="Acceleration" value={character.action_values?.['Acceleration'] || ''} onChange={handleAVChange} />
              <StyledTextField label="Handling" type="number" sx={{width: 100}} name="Handling" value={character.action_values?.['Handling'] || ''} onChange={handleAVChange} />
              <StyledTextField label="Squeal" type="number" sx={{width: 100}} name="Squeal" value={character.action_values?.['Squeal'] || ''} onChange={handleAVChange} />
              <StyledTextField label="Frame" type="number" sx={{width: 100}} name="Frame" value={character.action_values?.['Frame'] || ''} onChange={handleAVChange} />
              <StyledTextField label="Crunch" type="number" sx={{width: 100}} name="Crunch" value={character.action_values?.['Crunch'] || ''} onChange={handleAVChange} />
            </Stack>
            <DriverSelector vehicle={character} onChange={handleDriverChange} />
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
