import { useState } from 'react'
import { Box, Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CharacterModal from '@/components/characters/CharacterModal'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import type { Person, Character, Fight, ID } from "@/types/types"
import { defaultCharacter } from "@/types/types"

interface CreateCharacterParams {
  fight?: Fight,
  reload?: () => Promise<void>
}

export default function CreateCharacter({ fight, reload }: CreateCharacterParams) {
  const [newCharacter, setNewCharacter] = useState<Character | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  const openModal = (): void => {
    setNewCharacter({...defaultCharacter, new: true})
  }

  return (
    <>
      <Button color="primary" variant="contained" startIcon={<PersonAddIcon />} onClick={openModal}>
        New
      </Button>
      <CharacterModal character={newCharacter as Person} reload={reload} />
    </>
  )
}
