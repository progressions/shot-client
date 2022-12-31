import { useState } from 'react'
import { Tooltip, Paper, Button, ButtonGroup, Avatar, Stack } from '@mui/material'
import { TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Router from "next/router"
import CharacterModal from './CharacterModal'
import { useSession } from 'next-auth/react'
import BloodtypeIcon from '@mui/icons-material/Bloodtype'
import BoltIcon from '@mui/icons-material/Bolt'

export default function Character(props: any) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  const { endpoint, fight } = props
  const initialCharacter = props.character
  const [character, setCharacter] = useState(initialCharacter)
  const [open, setOpen] = useState(false)

  async function deleteCharacter(character: any) {
    const response = await fetch(`${endpoint}/${fight.id}/characters/${character.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    if (response.status === 200) {
      Router.reload()
    }
  }

  function editCharacter(character: any) {
    setOpen(true)
  }

  async function takeAction(character: any) {
    const response = await fetch(`${endpoint}/${fight.id}/characters/${character.id}/act`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    if (response.status === 200) {
      Router.reload()
    }
  }

  const defense = character.defense ? `Defense ${character.defense}` : ''
  const impairments = character.impairments ? `(-${character.impairments})` : ''
  const color = character.impairments > 0 ? 'error' : 'primary'
  return (
    <>
        <TableContainer>
          <Table sx={{width: "100%"}}>
            <TableBody>
              <TableRow>
                <TableCell sx={{width: 50}}>
                  <Avatar sx={{bgcolor: character.color || 'secondary'}} variant="rounded">{character.name[0]}</Avatar>
                </TableCell>
                <TableCell sx={{width: 200}}>
                  <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                    { character.name }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2">
                      {defense}
                    </Typography>
                    <Typography variant="body2">
                      {impairments}
                    </Typography>
                    { (character.impairments > 0) && (
                      <BloodtypeIcon color={color} sx={{height: '1em', width: '1em'}} />
                    ) }
                  </Stack>
                </TableCell>
                <TableCell sx={{width: 100}}>
                  <ButtonGroup variant="outlined" size="small">
                    <Tooltip title="Take Action" arrow>
                      <Button onClick={() => {takeAction(character)}}>
                        <BoltIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Edit Character" arrow>
                      <Button onClick={() => {editCharacter(character)}}>
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete Character" arrow>
                      <Button onClick={() => deleteCharacter(character)}>
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      <CharacterModal open={open} setOpen={setOpen} endpoint={endpoint} fight={fight} character={character} />
    </>
  )
}
