import { useState } from 'react'
import { Container, Grid, Box, TextField, Dialog, Badge, Tooltip, Paper, Button, ButtonGroup, Avatar, Stack } from '@mui/material'
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
import DeathMarks from "./DeathMarks"
import NameDisplay from "./NameDisplay"

import { loadFight } from '../FightDetail'
import Client from "../Client"

import type { Person, Character, Fight, Toast, ID } from "../../types/types"
import { defaultCharacter } from "../../types/types"

interface CharacterDetailsParams {
  character: Character,
  fight: Fight,
  setFight: React.Dispatch<React.SetStateAction<Fight>>
  editingCharacter: Character,
  setEditingCharacter: React.Dispatch<React.SetStateAction<Character>> | ((character: Character | null) => void)
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function CharacterDetails({ character, fight, setFight, editingCharacter, setEditingCharacter, setToast }: CharacterDetailsParams) {
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
      setToast({ open: true, message: `Character ${character.name} removed.`, severity: "success" })
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

  const impairments = character.impairments ? `(-${character.impairments})` : ''
  const color = character.impairments > 0 ? 'error' : 'primary'
  const wounds = character.action_values["Wounds"] || 0

  return (
    <>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{width: 50}}>
                <AvatarBadge character={character} session={session} />
              </TableCell>
              <TableCell>
                <NameDisplay character={character} />
              </TableCell>
              <TableCell sx={{width: 80}}>
                <GamemasterOnly user={session?.data?.user} character={character}>
                  <Stack direction="row" spacing={1}>
                    <Stack direction="column" sx={{width: 170}} alignItems="center">
                      <Typography variant="h3">{wounds}</Typography>
                      <Typography variant="h6" sx={{color: 'text.secondary', fontVariant: 'small-caps', textTransform: 'lowercase'}}>
                        { character.action_values["Type"] === "Mook" && "Mooks" }
                        { character.action_values["Type"] !== "Mook" && "Wounds" }
                      </Typography>
                    </Stack>
                  </Stack>
                </GamemasterOnly>
              </TableCell>
              <TableCell sx={{width: 200}}>
                <Stack spacing={1}>
                  <GamemasterOnly user={session?.data?.user} character={character}>
                    <ActionValues character={character} />
                  </GamemasterOnly>
                  { character.category === "character" && (["PC", "Ally"].includes(character.action_values["Type"] as string) &&
                    character.action_values["Marks of Death"] as number > 0) &&
                  <DeathMarks character={character} readOnly={true} /> }
                </Stack>
              </TableCell>
              <TableCell sx={{width: 100}}>
                <GamemasterOnly user={session?.data?.user} character={character}>
                  <ActionButtons character={character}
                    takeWounds={takeWounds}
                    takeAction={takeAction}
                    editCharacter={editCharacter}
                    deleteCharacter={deleteCharacter}
                    setToast={setToast}
                  />
                </GamemasterOnly>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <ActionModal open={openAction} setOpen={setOpenAction} fight={fight} character={character} setFight={setFight} setToast={setToast} />
      <WoundsModal open={openWounds} setOpen={setOpenWounds} fight={fight} character={character as Person} setFight={setFight} setToast={setToast} />
    </>
  )
}
