import { useState } from 'react'
import { Container, Grid, Box, TextField, Dialog, Badge, Tooltip, Paper, Button, ButtonGroup, Avatar, Stack } from '@mui/material'
import { TableHead, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { AlertColor } from "@mui/material"

import BloodtypeIcon from '@mui/icons-material/Bloodtype'
import WhatshotIcon from '@mui/icons-material/Whatshot'

import ActionValues from './ActionValues'
import ActionModal from './ActionModal'
import WoundsModal from './WoundsModal'
import KillMooksModal from './KillMooksModal'
import HealModal from './HealModal'
import ActionButtons from './ActionButtons'
import MookActionButtons from './MookActionButtons'
import AvatarBadge from './AvatarBadge'
import GamemasterOnly from '../GamemasterOnly'
import DeathMarks from "./DeathMarks"
import NameDisplay from "./NameDisplay"
import WoundsDisplay from "./WoundsDisplay"
import GroupedEffects from "../state_effects/GroupedEffects"
import SkillsDisplay from "./SkillsDisplay"
import SchticksDisplay from "./SchticksDisplay"
import WeaponsDisplay from "./WeaponsDisplay"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import Client from "../../utils/Client"
import PlayerTypeOnly from "../PlayerTypeOnly"

import type { Vehicle, CharacterEffect, User, Person, Character, Fight, Toast, ID } from "../../types/types"
import { defaultCharacter } from "../../types/types"
import { FightActions } from '../../reducers/fightState'

interface CharacterDetailsParams {
  character: Character,
  editingCharacter: Character,
  setEditingCharacter: React.Dispatch<React.SetStateAction<Character>> | ((character: Character | null) => void),
  className?: string
  hidden?: boolean
  shot: number
}

export default function CharacterDetails({ character, editingCharacter, setEditingCharacter, className, hidden, shot }: CharacterDetailsParams) {
  const { fight, dispatch } = useFight()

  const { session, client, user } = useClient()

  const [open, setOpen] = useState<Character>(defaultCharacter)
  const [openAction, setOpenAction] = useState(false)
  const [openWounds, setOpenWounds] = useState(false)
  const [openHeal, setOpenHeal] = useState(false)
  const { toastSuccess, toastError } = useToast()

  function closeAction() {
    setOpenAction(false)
  }

  async function deleteCharacter(character: Character): Promise<void> {
    const doit = confirm(`Remove ${character.name} from the fight?`)
    if (doit) {
      try {
        await client.deleteCharacter(character, fight)
        toastSuccess(`${character.name} removed.`)
        dispatch({ type: FightActions.EDIT })
      } catch(error) {
        toastError()
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
      name: "Dodge",
      action_value: "Defense",
      change: "+3",
      severity: "success",
      shot_id: character.shot_id,
      [`${character.category}_id`]: character.id
    } as CharacterEffect
  }

  const addDodgeEffect = async (character: Character) => {
    try {
      const data = await client.createCharacterEffect(dodge(character), fight)
      return !!data
    } catch(error) {
      console.error(error)
      toastError()
    }
  }

  const takeDodgeAction = async (character: Character) => {
    try {
      await client.actCharacter(character, fight, 1)
      toastSuccess(`${character.name} dodged for 1 shot.`)
      await addDodgeEffect(character)
      dispatch({ type: FightActions.EDIT })
    } catch(error) {
      toastError()
    }
  }

  const hideCharacter = async (character: Character | Vehicle): Promise<void> => {
    try {
      await client.hideCharacter(fight, character)
      dispatch({ type: FightActions.EDIT })
    } catch(error) {
      toastError()
    }
  }

  const showCharacter = async (character: Character | Vehicle): Promise<void> => {
    try {
      await client.showCharacter(fight, character)
      dispatch({ type: FightActions.EDIT })
    } catch(error) {
      toastError()
    }
  }

  const impairments = character.impairments ? `(-${character.impairments})` : ''
  const color = character.impairments > 0 ? 'error' : 'primary'
  const showDeathMarks = character.category === "character" &&
    (["PC", "Ally"].includes(character.action_values["Type"] as string) &&
    character.action_values["Marks of Death"] as number > 0)

  const key = `CharacterDetails ${character.id}`

  return (
    <TableRow key={key} className={className}>
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
            hideCharacter={hideCharacter}
            showCharacter={showCharacter}
            hidden={hidden}
            shot={shot}
          />
          <GamemasterOnly user={user} character={character}>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <ActionValues character={character} />
              <PlayerTypeOnly character={character} except="Mook">
                <ActionButtons character={character}
                  healWounds={healWounds}
                  takeWounds={takeWounds}
                  takeAction={takeAction}
                  takeDodgeAction={takeDodgeAction}
                />
              </PlayerTypeOnly>
              <PlayerTypeOnly character={character} only="Mook">
                <MookActionButtons character={character}
                  healWounds={healWounds}
                  takeWounds={takeWounds}
                  takeAction={takeAction}
                />
              </PlayerTypeOnly>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <SchticksDisplay schticks={character.schticks} />
              <SkillsDisplay skills={character.skills} />
              <WeaponsDisplay weapons={character.weapons} />
            </Stack>
          </GamemasterOnly>
          <GroupedEffects character={character} />
        </Stack>
      <ActionModal open={openAction}
        setOpen={setOpenAction}
        character={character}
      />
      <PlayerTypeOnly character={character} except="Mook">
        <WoundsModal open={openWounds}
          setOpen={setOpenWounds}
          character={character as Person}
        />
      </PlayerTypeOnly>
      <PlayerTypeOnly character={character} only="Mook">
        <KillMooksModal open={openWounds}
          setOpen={setOpenWounds}
          character={character as Person}
        />
      </PlayerTypeOnly>
      <HealModal open={openHeal}
        setOpen={setOpenHeal}
        character={character as Person}
      />
      </TableCell>
    </TableRow>
  )
}
