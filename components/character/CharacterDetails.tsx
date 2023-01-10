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

import { loadFight } from '../FightDetail'
import Client from "../Client"

import type { Character, Fight, ID } from "../../types/types"
import { defaultCharacter } from "../../types/types"

interface CharacterDetailsParams {
  character: Character,
  fight: Fight,
  setFight: React.Dispatch<React.SetStateAction<Fight>>
  editingCharacter: Character,
  setEditingCharacter: React.Dispatch<React.SetStateAction<Character>> | ((character: Character | null) => void)
}

export default function CharacterDetails({ character, fight, setFight, editingCharacter, setEditingCharacter }: CharacterDetailsParams) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const [open, setOpen] = useState<Character>(defaultCharacter)
  const [openAction, setOpenAction] = useState(false)
  const [openWounds, setOpenWounds] = useState(false)

  function closeAction() {
    setOpenAction(false)
  }

  async function deleteCharacter(character: Character): Promise<void> {
    const response = await client.deleteCharacter(character, fight)
    if (response.status === 200) {
      await loadFight({jwt, id: fight.id as string, setFight})
    }
  }

  function editCharacter(character: Character): void {
    setEditingCharacter(character)
  }

  function takeAction(character: Character): void {
    setOpenAction(true)
  }

  function takeWounds(character: Character): void {
    setOpenWounds(true)
  }

  const defense = character.defense ? `Defense ${character.defense}` : ''
  const impairments = character.impairments ? `(-${character.impairments})` : ''
  const color = character.impairments > 0 ? 'error' : 'primary'
  const wounds = parseInt(character.action_values["Wounds"]) > 0 ? character.action_values["Wounds"] : ''

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
                  <Typography variant="h3">{wounds}</Typography>
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
