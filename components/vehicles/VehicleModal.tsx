import { MouseEventHandler, useState, useEffect } from 'react'
import { FormControlLabel, Checkbox, InputAdornment, Dialog, Box, Stack, TextField, Button, Paper, Popover } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommuteIcon from '@mui/icons-material/Commute'
import CarCrashIcon from '@mui/icons-material/CarCrash'

import Router from 'next/router'

import CharacterType from '../character/CharacterType'

import { useSession } from 'next-auth/react'
import { BlockPicker } from 'react-color'
import { loadFight } from '../FightDetail'
import Client from "../Client"

import type { Vehicle, Fight, Character, Toast, ID } from "../../types/types"
import { defaultVehicle } from "../../types/types"

interface VehicleModalParams {
  open: Vehicle,
  setOpen: React.Dispatch<React.SetStateAction<Vehicle>>
  fight?: Fight,
  setFight?: React.Dispatch<React.SetStateAction<Fight>>
  character: Vehicle | null
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function CharacterModal({ open, setOpen, fight, setFight, character:activeVehicle, setToast }: VehicleModalParams) {
  const [picker, setPicker] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt: jwt })

  const [saving, setSaving] = useState(false);

  const [character, setCharacter] = useState<Vehicle>(activeVehicle || defaultVehicle)
  const method = character?.id ? 'PATCH' : 'POST'

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

  const handleAVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const newVehicle = !!character.id

    const response = newVehicle ?
      await client.updateVehicle(character, fight) :
      await client.createVehicle(character, fight)

    if (response.status === 200) {
      const data = await response.json()

      setCharacter(data)
      setSaving(false)
      cancelForm()
      if (fight && setFight) {
        await loadFight({jwt, id: fight.id as string, setFight})
        setToast({ open: true, message: `Vehicle ${character.name} updated.`, severity: "success" })
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

  return (
    <>
      <Dialog
        open={!!(open.id || open.new) && open.category === "vehicle"}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableRestoreFocus
      >
        <Box p={4} component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <CharacterType value={character.action_values?.['Type'] as string || ''} onChange={handleAVChange} />
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
            <Stack alignItems="flex-end" spacing={2} direction="row">
              <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
              <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>
    </>
  )
}
