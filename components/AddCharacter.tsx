import { useState } from 'react'
import { Box, Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Router from "next/router"
import TextField from '@mui/material/TextField'
import CharacterModal from './CharacterModal'

export default function AddCharacter(props: any) {
  const [open, setOpen] = useState(false)
  const { endpoint, fight } = props

  return (
    <>
      <Stack direction="row" mb={1}>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Character
        </Button>
      </Stack>
      <CharacterModal open={open} setOpen={setOpen} endpoint={endpoint} fight={fight} />
    </>
  )
}
