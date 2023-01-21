import { useState } from 'react'
import { Container, Grid, Box, TextField, Dialog, Badge, Tooltip, Paper, Button, ButtonGroup, Avatar, Stack } from '@mui/material'
import { TableHead, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useSession } from 'next-auth/react'
import { AlertColor } from "@mui/material"

import BloodtypeIcon from '@mui/icons-material/Bloodtype'
import WhatshotIcon from '@mui/icons-material/Whatshot'

import ActionValues from './ActionValues'
import ActionModal from './ActionModal'
import WoundsModal from './WoundsModal'
import HealModal from './HealModal'
import ActionButtons from './ActionButtons'
import AvatarBadge from './AvatarBadge'
import GamemasterOnly from '../GamemasterOnly'
import DeathMarks from "./DeathMarks"
import NameDisplay from "./NameDisplay"
import WoundsDisplay from "./WoundsDisplay"
import GroupedEffects from "../character_effects/GroupedEffects"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import Client from "../Client"

import type { CharacterEffect, User, Person, Character, Fight, Toast, ID } from "../../types/types"
import { defaultCharacter } from "../../types/types"

interface CharacterDetailsParams {
  character: Character,
  editingCharacter: Character,
  setEditingCharacter: React.Dispatch<React.SetStateAction<Character>> | ((character: Character | null) => void)
}

export default function CharacterDetails({ character, editingCharacter, setEditingCharacter }: CharacterDetailsParams) {
  const { fight, setFight, reloadFight } = useFight()

  const { session, client, user } = useClient()

  const [open, setOpen] = useState<Character>(defaultCharacter)
  const [openAction, setOpenAction] = useState(false)
  const [openWounds, setOpenWounds] = useState(false)
  const [openHeal, setOpenHeal] = useState(false)
  const { setToast } = useToast()

  function closeAction() {
    setOpenAction(false)
  }

  async function deleteCharacter(character: Character): Promise<void> {
    const doit = confirm(`Remove ${character.name} from the fight?`)
    if (doit) {
      const response = await client.deleteCharacter(character, fight)
      if (response.status === 200) {
        setToast({ open: true, message: `${character.name} removed.`, severity: "success" })
        await reloadFight(fight)
      }
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

  function healWounds(character: Character): void {
    setOpenHeal(true)
  }

  const dodge = (character: Character): CharacterEffect => {
    return {
      title: "Dodge",
      action_value: "Defense",
      change: "+3",
      severity: "success",
      [`${character.category}_id`]: character.id
    } as CharacterEffect
  }

  const addDodgeEffect = async (character: Character) => {
    const response = await client.createCharacterEffect(dodge(character), fight)
    if (response.status === 200) {
      return true
    } else {
      const data = await response.json()
      setToast({ open: true, message: `There was an error.`, severity: "error" })
    }
  }

  const takeDodgeAction = async (character: Character) => {
    const response = await client.actCharacter(character, fight, 1)
    if (response.status === 200) {
      setToast({ open: true, message: `${character.name} dodged for 1 shot.`, severity: "success" })
      await addDodgeEffect(character)
      await reloadFight(fight)
    } else {
      setToast({ open: true, message: `There was an error.`, severity: "error" })
    }
  }

  const impairments = character.impairments ? `(-${character.impairments})` : ''
  const color = character.impairments > 0 ? 'error' : 'primary'
  const showDeathMarks = character.category === "character" &&
    (["PC", "Ally"].includes(character.action_values["Type"] as string) &&
    character.action_values["Marks of Death"] as number > 0)

  const key = `CharacterDetails ${character.id}`

  return (
    <TableRow key={key}>
      <TableCell sx={{width: 50, verticalAlign: "top"}}>
        <AvatarBadge character={character} user={user} />
      </TableCell>
      <TableCell sx={{width: 70, verticalAlign: "top"}}>
        <WoundsDisplay character={character as Person} user={user} />
      </TableCell>
      <TableCell sx={{verticalAlign: "top"}}>
        <Stack spacing={2}>
          <NameDisplay character={character}
            editCharacter={editCharacter}
            deleteCharacter={deleteCharacter}
          />
          <GamemasterOnly user={user} character={character}>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <ActionValues character={character} />
              <ActionButtons character={character}
                healWounds={healWounds}
                takeWounds={takeWounds}
                takeAction={takeAction}
                takeDodgeAction={takeDodgeAction}
              />
            </Stack>
            <GroupedEffects character={character} />
          </GamemasterOnly>
        </Stack>
      <ActionModal open={openAction}
        setOpen={setOpenAction}
        character={character}
      />
      <WoundsModal open={openWounds}
        setOpen={setOpenWounds}
        character={character as Person}
      />
      <HealModal open={openHeal}
        setOpen={setOpenHeal}
        character={character as Person}
      />
      </TableCell>
    </TableRow>
  )
}
