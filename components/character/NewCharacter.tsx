import { useState } from 'react'
import { Box, Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CharacterModal from './CharacterModal'

const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function CreateCharacter({ fight, setFight }: any) {
  const characterTemplate = {fight_id: fight?.id, name: '', defense: null, current_shot: 0, impairments: null, color: '', action_values: {}, new: false}
  const [newCharacter, setNewCharacter] = useState(characterTemplate)

  const openModal = () => {
    setNewCharacter({...characterTemplate, new: true})
  }

  return (
    <>
      <Stack direction="row" mb={1}>
        <Button variant="outlined" onClick={openModal}>
          New Character
        </Button>
      </Stack>
      <CharacterModal open={!!newCharacter?.new} setOpen={setNewCharacter} fight={fight} character={newCharacter} setFight={setFight} />
    </>
  )
}
