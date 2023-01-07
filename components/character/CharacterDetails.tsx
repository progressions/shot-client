import { useState } from 'react'
import { Grid, Box, TextField, Dialog, Badge, Tooltip, Paper, Button, ButtonGroup, Avatar, Stack } from '@mui/material'
import { TableHead, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useSession } from 'next-auth/react'

import BloodtypeIcon from '@mui/icons-material/Bloodtype'
import WhatshotIcon from '@mui/icons-material/Whatshot'

import ActionValues from './ActionValues'
import ActionModal from './ActionModal'
import WoundsModal from './WoundsModal'
import ActionButtons from './ActionButtons'
import AvatarBadge from './AvatarBadge'
import GamemasterOnly from '../GamemasterOnly'

import { loadFight } from '../Fight'

const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function CharacterDetails({ character, fight, setFight, editingCharacter, setEditingCharacter }: any) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  const [open, setOpen] = useState(false)
  const [openAction, setOpenAction] = useState(false)
  const [openWounds, setOpenWounds] = useState(false)

  function closeAction() {
    setOpenAction(false)
  }

  async function deleteCharacter(character: any) {
    const response = await fetch(`${apiUrl}/api/v1/fights/${fight.id}/characters/${character.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    if (response.status === 200) {
      await loadFight({jwt, id: fight.id, setFight})
    }
  }

  function editCharacter(character: any) {
    setEditingCharacter(character)
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
                <AvatarBadge character={character} session={session} />
              </TableCell>
              <TableCell sx={{width: 200}}>
                <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                  { character.name }
                </Typography>
              </TableCell>
              <TableCell sx={{width: 60}}>
                <GamemasterOnly user={session?.data?.user} character={character}>
                  <Typography variant="h3">{(character.action_values['Wounds'] > 0) ? character.action_values['Wounds'] : ''}</Typography>
                </GamemasterOnly>
              </TableCell>
              <TableCell>
                <GamemasterOnly user={session?.data?.user} character={character}>
                  <ActionValues character={character} />
                </GamemasterOnly>
              </TableCell>
              <TableCell sx={{width: 100}}>
                <GamemasterOnly user={session?.data?.user} character={character}>
                  <ActionButtons character={character}
                    takeWounds={takeWounds}
                    takeAction={takeAction}
                    editCharacter={editCharacter}
                    deleteCharacter={deleteCharacter}
                  />
                </GamemasterOnly>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <ActionModal open={openAction} setOpen={setOpenAction} fight={fight} character={character} setFight={setFight} />
      <WoundsModal open={openWounds} setOpen={setOpenWounds} fight={fight} character={character} setFight={setFight} />
    </>
  )
}
