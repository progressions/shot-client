import { useState } from 'react'
import { Box, Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CharacterModal from './CharacterModal'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import type { Person, Character, Fight, Toast, ID } from "../../types/types"
import { defaultCharacter } from "../../types/types"

interface CreateCharacterParams {
  fight?: Fight,
  setFight?: React.Dispatch<React.SetStateAction<Fight>>
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function CreateCharacter({ fight, setFight, setToast }: CreateCharacterParams) {
  const [newCharacter, setNewCharacter] = useState<Character>(defaultCharacter)

  const openModal = (): void => {
    setNewCharacter({...defaultCharacter, new: true})
  }

  return (
    <>
      <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={openModal}>
        New
      </Button>
      <CharacterModal open={newCharacter} setOpen={setNewCharacter} fight={fight} character={newCharacter as Person} setFight={setFight} setToast={setToast} />
    </>
  )
}
