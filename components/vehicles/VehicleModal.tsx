import { MouseEventHandler, useState, useEffect } from 'react'
import { Switch, FormControl, FormLabel, RadioGroup, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, InputAdornment, Dialog, Box, Stack, TextField, Button, Paper, Popover } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommuteIcon from '@mui/icons-material/Commute'
import CarCrashIcon from '@mui/icons-material/CarCrash'

import Router from 'next/router'

import CharacterType from '../characters/edit/CharacterType'

import { useSession } from 'next-auth/react'
import { BlockPicker } from 'react-color'
import Client from "../Client"
import PositionSelector from "./PositionSelector"
import PursuerSelector from "./PursuerSelector"

import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import type { Vehicle, Fight, Character, Toast, ID } from "../../types/types"
import { defaultVehicle } from "../../types/types"

interface VehicleModalParams {
  open: Vehicle,
  setOpen: React.Dispatch<React.SetStateAction<Vehicle>>
  fight?: Fight,
  setFight?: React.Dispatch<React.SetStateAction<Fight>>
  character: Vehicle | null
}

export default function CharacterModal({ open, setOpen, character:activeVehicle }: VehicleModalParams) {
  const [picker, setPicker] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const { setToast } = useToast()
  const { client } = useClient()
  const { fight, setFight, reloadFight } = useFight()

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

  const handleCheck = (event: any) => {
    setCharacter((prevState: Vehicle) => ({ ...prevState, [event.target.name]: event.target.checked }))
  }

  const handleAVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("value", event.target.value)
    const { action_values } = character || {}
    setCharacter((prevState: any) => ({ ...prevState, action_values: { ...action_values, [event.target.name]: event.target.value } }))
  }

  const handleColor = (color: any) => {
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

    const response = newVehicle ?
      await client.createVehicle(character, fight) :
      await client.updateVehicle(character, fight)

    if (response.status === 200) {
      const data = await response.json()

      setCharacter(data)
      setSaving(false)
      cancelForm()
      if (newVehicle) {
        setToast({ open: true, message: `${character.name} created.`, severity: "success" })
      } else {
        setToast({ open: true, message: `${character.name} updated.`, severity: "success" })
      }
      if (fight?.id) {
        await reloadFight(fight)
      } else {
        Router.reload()
      }
    } else {
      setToast({ open: true, message: `There was an error`, severity: "error" })
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
      setAnchorEl(event.target as any)
    }
  }

  const woundsLabel = character.action_values["Type"] === "Mook" ? "Mooks" : "Chase"
  const dialogTitle = newVehicle ? "Create Vehicle" : "Update Vehicle"

  return (
    <>
      <Dialog
        open={!!(open.id || open.new) && open.category === "vehicle"}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableRestoreFocus
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit} pb={1}>
          <DialogContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <CharacterType value={character.action_values?.['Type'] as string || ''} onChange={handleAVChange} />
                <FormControlLabel label="Active" name="active" control={<Switch checked={character.active} />} onChange={handleCheck} />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField autoFocus label="Name" variant="filled" size="medium" sx={{paddingBottom: 2}} fullWidth required name="name" value={character.name} onChange={handleChange} />
                { fight &&
                <TextField label="Shot" type="number" name="current_shot" value={character.current_shot === null ? '' : character.current_shot} onChange={handleChange} sx={{width: 80}} /> }
              </Stack>
              <Stack spacing={2} direction="row" alignItems='center'>
                <TextField label={woundsLabel} type="number" name="Chase Points" value={character.action_values?.['Chase Points'] || ''} onChange={handleAVChange}
                  InputProps={{startAdornment: <InputAdornment position="start"><CommuteIcon color='error' /></InputAdornment>}} />
                <TextField label="Condition" type="number" name="Condition Points" value={character.action_values?.['Condition Points'] || ''} onChange={handleAVChange}
                  InputProps={{startAdornment: <InputAdornment position="start"><CarCrashIcon color='error' /></InputAdornment>}} />
                <TextField label="Impairments" type="number" name="impairments" value={character.impairments || ''} onChange={handleChange} />
                <Button sx={{width: 2, height: 50, bgcolor: character.color, borderColor: 'primary', border: 1, borderRadius: 2}} onClick={togglePicker} />
                <TextField id="colorPicker" label="Color" name="color" value={character.color || ''} onChange={handleChange} />
              </Stack>
              <Popover anchorEl={anchorEl} open={picker} onClose={() => setPicker(false)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                <Paper>
                  <BlockPicker color={character.color || ''} onChangeComplete={handleColor} colors={['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']} />
                </Paper>
              </Popover>
              <Stack direction="row" spacing={2}>
                <TextField label="Acceleration" type="number" sx={{width: 100}} name="Acceleration" value={character.action_values?.['Acceleration'] || ''} onChange={handleAVChange} />
                <TextField label="Handling" type="number" sx={{width: 100}} name="Handling" value={character.action_values?.['Handling'] || ''} onChange={handleAVChange} />
                <TextField label="Squeal" type="number" sx={{width: 100}} name="Squeal" value={character.action_values?.['Squeal'] || ''} onChange={handleAVChange} />
                <TextField label="Frame" type="number" sx={{width: 100}} name="Frame" value={character.action_values?.['Frame'] || ''} onChange={handleAVChange} />
                <TextField label="Crunch" type="number" sx={{width: 100}} name="Crunch" value={character.action_values?.['Crunch'] || ''} onChange={handleAVChange} />
              </Stack>
              <Stack direction="row" spacing={2}>
                <PositionSelector character={character} onChange={handleAVChange} />
                <PursuerSelector character={character} onChange={handleAVChange} />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack spacing={2} direction="row">
              <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
              <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
