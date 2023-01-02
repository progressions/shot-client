import { useState } from 'react'
import { Grid, Item, Box, TextField, Dialog, Badge, Tooltip, Paper, Button, ButtonGroup, Avatar, Stack } from '@mui/material'
import { TableHead, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSession } from 'next-auth/react'
import BloodtypeIcon from '@mui/icons-material/Bloodtype'
import BoltIcon from '@mui/icons-material/Bolt'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

import CharacterModal from './CharacterModal'
import ActionValues from './ActionValues'
import ActionModal from './ActionModal'
import WoundsModal from './WoundsModal'

import { loadFight } from '../Fight'

export default function Character({ character, endpoint, fight, setFight }: any) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  const [open, setOpen] = useState(false)
  const [openAction, setOpenAction] = useState(false)
  const [openWounds, setOpenWounds] = useState(false)

  function closeAction() {
    setOpenAction(false)
  }

  async function deleteCharacter(character: any) {
    const response = await fetch(`${endpoint}/${fight.id}/characters/${character.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    if (response.status === 200) {
      await loadFight({endpoint, jwt, id: fight.id, setFight})
    }
  }

  function editCharacter(character: any) {
    setOpen(true)
  }

  async function takeAction(character: any) {
    setOpenAction(true)
  }

  async function takeWounds(character: any) {
    setOpenWounds(true)
  }

  const defense = character.defense ? `Defense ${character.defense}` : ''
  const impairments = character.impairments ? `(-${character.impairments})` : ''
  const color = character.impairments > 0 ? 'error' : 'primary'
  return (
    <>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{width: 50}}>
                  <Badge color='error' badgeContent={character.impairments}>
                    <Avatar sx={{bgcolor: character.color || 'secondary'}} variant="rounded">{character.name[0]}</Avatar>
                  </Badge>
                </TableCell>
                <TableCell sx={{width: 200}}>
                  <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                    { character.name }
                  </Typography>
                </TableCell>
                <TableCell sx={{width: 60}}>
                  <Typography variant="h3">{(character.action_values['Wounds'] > 0) ? character.action_values['Wounds'] : ''}</Typography>
                </TableCell>
                <TableCell>
                  <ActionValues character={character} />
                </TableCell>
                <TableCell sx={{width: 100}}>
                  <ButtonGroup variant="outlined" size="small">
                    <Tooltip title="Take Wounds" arrow>
                      <Button onClick={() => {takeWounds(character)}}>
                        <HeartBrokenIcon color='error' />
                      </Button>
                    </Tooltip>
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
      <CharacterModal open={open} setOpen={setOpen} endpoint={endpoint} fight={fight} character={character} setFight={setFight} />
      <ActionModal open={openAction} setOpen={setOpenAction} endpoint={endpoint} fight={fight} character={character} setFight={setFight} />
      <WoundsModal open={openWounds} setOpen={setOpenWounds} endpoint={endpoint} fight={fight} character={character} setFight={setFight} />
    </>
  )
}
/*
                  <Grid container spacing={1}>
                    <Grid item>
                      <Typography variant="body2" sx={{textAlign: 'center'}}>
                        Attack {character.action_values['Guns']}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" sx={{textAlign: 'center'}}>
                        Defense {character.action_values['Defense']}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" sx={{textAlign: 'center'}}>
                        Toughness {character.action_values['Toughness']}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" sx={{textAlign: 'center'}}>
                        Speed {character.action_values['Speed']}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" sx={{textAlign: 'center'}}>
                        Fortune {character.action_values['Fortune']}
                      </Typography>
                    </Grid>
                  </Grid>
*/
