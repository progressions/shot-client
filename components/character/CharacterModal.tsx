import { MouseEventHandler, useState, useEffect } from 'react'
import { Rating, InputAdornment, Dialog, Box, Stack, TextField, Button, Paper, Popover } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { IoSkull, IoSkullOutline } from "react-icons/io5"
import { styled } from '@mui/material/styles'

import Router from 'next/router'

import CharacterType from './CharacterType'

import { useSession } from 'next-auth/react'
import { BlockPicker } from 'react-color'
import { loadFight } from '../FightDetail'
import Client from "../Client"

import type { Fight, Character, Toast, ID } from "../../types/types"
import { defaultCharacter } from "../../types/types"

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#000',
  },
  '& .MuiRating-iconHover': {
    color: '#333',
  },
});

interface CharacterModalParams {
  open: Character,
  setOpen: React.Dispatch<React.SetStateAction<Character>>
  fight?: Fight,
  setFight?: React.Dispatch<React.SetStateAction<Fight>>
  character: Character | null
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function CharacterModal({ open, setOpen, fight, setFight, character:activeCharacter, setToast }: CharacterModalParams) {
  const [picker, setPicker] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt: jwt })

  const [saving, setSaving] = useState(false);

  const [character, setCharacter] = useState<Character>(activeCharacter || defaultCharacter)
  const method = character?.id ? 'PATCH' : 'POST'

  useEffect(() => {
    if (activeCharacter) {
      setCharacter(activeCharacter)
    }
  }, [activeCharacter])

  function handleClose() {
    cancelForm()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacter((prevState: Character) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const handleAVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { action_values } = character || {}
    setCharacter((prevState: Character) => ({ ...prevState, action_values: { ...action_values, [event.target.name]: event.target.value } }))
  }

  const handleDeathMarks = (event: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
    const { action_values } = character || {}
    console.log(newValue)
    const value = (newValue === character.action_values["Marks of Death"]) ? 0 : newValue
    setCharacter((prevState: Character) => ({ ...prevState, action_values: { ...action_values, "Marks of Death": value as number } }))
  }

  const handleColor = (color: any) => {
    setCharacter((prevState: Character) => ({ ...prevState, color: color?.hex }))
    setPicker(false)
    setAnchorEl(null)
  }

  const cancelForm = () => {
    setCharacter(character || defaultCharacter)
    setOpen(defaultCharacter)
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    setSaving(true)
    event.preventDefault()

    const newCharacter = !!character.id

    const response = newCharacter ?
      await client.updateCharacter(character, fight) :
      await client.createCharacter(character, fight)

    if (response.status === 200) {
      const data = await response.json()

      setCharacter(data)
      setSaving(false)
      cancelForm()
      if (fight && setFight) {
        await loadFight({jwt, id: fight.id as string, setFight})
        setToast({ open: true, message: `Character ${character.name} updated.`, severity: "success" })
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

  const woundsLabel = character.action_values["Type"] === "Mook" ? "Mooks" : "Wounds"

  return (
    <>
      <Dialog
        open={!!(open.id || open.new)}
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
              <TextField label={woundsLabel} type="number" name="Wounds" value={character.action_values?.['Wounds'] || ''} onChange={handleAVChange}
                InputProps={{startAdornment: <InputAdornment position="start"><FavoriteIcon color='error' /></InputAdornment>}} />
              { character.action_values["Type"] === "PC" &&
                <StyledRating
                  name="Marks of Death"
                  onChange={handleDeathMarks}
                  value={character.action_values["Marks of Death"] as number}
                  icon={<IoSkull />}
                  emptyIcon={<IoSkullOutline />}
                  max={5} />
              }
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
              <TextField label="Attack" type="number" sx={{width: 100}} name="Guns" value={character.action_values?.['Guns'] || ''} onChange={handleAVChange} />
              <TextField label="Defense" type="number" sx={{width: 100}} name="Defense" value={character.action_values?.['Defense'] || ''} onChange={handleAVChange} />
              <TextField label="Toughness" type="number" sx={{width: 100}} name="Toughness" value={character.action_values?.['Toughness'] || ''} onChange={handleAVChange} />
              <TextField label="Fortune" type="number" sx={{width: 100}} name="Fortune" value={character.action_values?.['Fortune'] || ''} onChange={handleAVChange} />
              <TextField label="Speed" type="number" sx={{width: 100}} name="Speed" value={character.action_values?.['Speed'] || ''} onChange={handleAVChange} />
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
