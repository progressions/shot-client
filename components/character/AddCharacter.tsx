import { useState } from 'react'
import { Box, Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CharacterModal from './CharacterModal'

export default function AddCharacter({ endpoint, fight, setFight }: any) {
  const [newCharacter, setNewCharacter] = useState(false)

  return (
    <>
      <Stack direction="row" mb={1}>
        <Button variant="outlined" onClick={() => setNewCharacter({name: '', action_values: []})}>
          Add Character
        </Button>
      </Stack>
      <CharacterModal open={!!newCharacter} setOpen={setNewCharacter} endpoint={endpoint} fight={fight} character={newCharacter} setFight={setFight} />
    </>
  )
}
