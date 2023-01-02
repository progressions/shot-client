import { useState } from 'react'
import { Grid, Box, TextField, Dialog, Badge, Tooltip, Paper, Button, ButtonGroup, Avatar, Stack } from '@mui/material'
import { TableHead, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useSession } from 'next-auth/react'
import BloodtypeIcon from '@mui/icons-material/Bloodtype'

import CharacterModal from './CharacterModal'
import ActionValues from './ActionValues'
import ActionModal from './ActionModal'
import WoundsModal from './WoundsModal'
import ActionButtons from './ActionButtons'

import { loadFight } from '../Fight'

export default function CharacterDetails({ character, endpoint, fight, setFight, editingCharacter, setEditingCharacter }: any) {
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

  const GamemasterOnly = ({ user, children, character, override }: any) => {
    if (override || user?.gamemaster || character?.action_values?.['Type'] === 'PC') {
      return children
    }
  }

  const CharacterTypeBadge = ({ character }: any) => {
    const names = {
      "PC": "PC",
      "Mook": "Mook",
      "Featured Foe": "Foe",
      "Boss": "Boss",
      "Uber-Boss": "User"
    } as any
    const charType = character?.action_values?.['Type']
    return (
      <Box width={40} sx={{textAlign: 'center'}}>
        <Typography variant="h6" sx={{color: 'text.secondary', fontVariant: 'small-caps'}}>{names[charType].toLowerCase()}</Typography>
      </Box>
    )
  }

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
                <GamemasterOnly user={session?.data?.user} character={character}>
                  <CharacterTypeBadge character={character} />
                </GamemasterOnly>
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
      <ActionModal open={openAction} setOpen={setOpenAction} endpoint={endpoint} fight={fight} character={character} setFight={setFight} />
      <WoundsModal open={openWounds} setOpen={setOpenWounds} endpoint={endpoint} fight={fight} character={character} setFight={setFight} />
    </>
  )
}
