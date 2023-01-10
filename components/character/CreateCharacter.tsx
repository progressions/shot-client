import { useState } from 'react'
import { Box, Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CharacterModal from './CharacterModal'

import type { Character, Fight, Toast, ID } from "../../types/types"
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
      <Stack direction="row" mb={1}>
        <Button variant="outlined" onClick={openModal}>
          New Character
        </Button>
      </Stack>
      <CharacterModal open={newCharacter} setOpen={setNewCharacter} fight={fight} character={newCharacter} setFight={setFight} setToast={setToast} />
    </>
  )
}
