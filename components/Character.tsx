import { useState } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import Router from "next/router"
import CharacterModal from './CharacterModal'

export default function Character(props: any) {
  const { endpoint, fight } = props
  const initialCharacter = props.character
  const [character, setCharacter] = useState(initialCharacter)
  const [open, setOpen] = useState(false)

  async function deleteCharacter(character: any) {
    const response = await fetch(`${endpoint}/${fight.id}/characters/${character.id}`, {
      method: 'DELETE'
    })
    if (response.status === 200) {
      Router.reload()
    }
  }

  function editCharacter(character: any) {
    setOpen(true)
  }

  const defense = character.defense ? `(D${character.defense})` : ''
  const impairments = character.impairments ? `(-${character.impairments})` : ''
  return (
    <>
      <TableRow key={character.id}>
        <TableCell>
          <Stack spacing={1} direction="row">
            <Typography sx={{fontWeight: 'bold'}}>
              {character.name}
            </Typography>
            <Typography>
              {defense}
            </Typography>
            <Typography>
              {impairments}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <IconButton onClick={() => {editCharacter(character)}}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteCharacter(character)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <CharacterModal open={open} setOpen={setOpen} endpoint={endpoint} fight={fight} character={character} />
    </>
  )
}
