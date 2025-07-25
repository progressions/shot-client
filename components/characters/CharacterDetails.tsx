import { useState } from 'react'
import { Container, Grid, Box, TextField, Dialog, Badge, Tooltip, Paper, Button, ButtonGroup, Avatar, Stack } from '@mui/material'
import { TableHead, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { AlertColor } from "@mui/material"

import BloodtypeIcon from '@mui/icons-material/Bloodtype'
import WhatshotIcon from '@mui/icons-material/Whatshot'

import ActionButtonsWrapper from "@/components/characters/ActionButtonsWrapper"
import ActionValues from '@/components/characters/ActionValues'
import ActionModal from '@/components/characters/ActionModal'
import WoundsModal from '@/components/characters/WoundsModal'
import KillMooksModal from '@/components/characters/KillMooksModal'
import HealModal from '@/components/characters/HealModal'
import ActionButtons from '@/components/characters/ActionButtons'
import MookActionButtons from '@/components/characters/MookActionButtons'
import AvatarBadge from '@/components/characters/AvatarBadge'
import DeathMarks from "@/components/characters/DeathMarks"
import NameDisplay from "@/components/characters/NameDisplay"
import WoundsDisplay from "@/components/characters/WoundsDisplay"
import SkillsDisplay from "@/components/characters/SkillsDisplay"
import SchticksDisplay from "@/components/characters/SchticksDisplay"
import WeaponsDisplay from "@/components/characters/WeaponsDisplay"
import DrivingDetails from "@/components/characters/DrivingDetails"

import GroupedEffects from "@/components/character_effects/GroupedEffects"
import GamemasterOnly from '@/components/GamemasterOnly'
import { useFight } from "@/contexts/FightContext"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import Client from "@/utils/Client"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import CS from "@/services/CharacterService"
import FES from "@/services/FightEventService"

import type { Vehicle, CharacterEffect, User, Person, Character, Fight, Toast, ID } from "@/types/types"
import { defaultCharacter } from "@/types/types"
import { FightActions } from '@/reducers/fightState'

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

  const { client, user } = useClient()

  const [open, setOpen] = useState<Character>(defaultCharacter)
  const [openAction, setOpenAction] = useState(false)
  const [openWounds, setOpenWounds] = useState(false)
  const [openHeal, setOpenHeal] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const firstShot = fight.shot_order[0][0]
  const first = (shot == firstShot) // && firstCharacter

  function closeAction() {
    setOpenAction(false)
  }

  async function deleteCharacter(character: Character): Promise<void> {
    const doit = confirm(`Remove ${character.name} from the fight?`)
    if (doit) {
      try {
        await client.deleteCharacter(character, fight)
        await FES.removeCharacter(client, fight, character)
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

  function takeAction(): void {
    setOpenAction(true)
  }

  function takeWounds(): void {
    setOpenWounds(true)
  }

  function healWounds(): void {
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
      await FES.dodge(client, fight, character, 1)
      toastSuccess(`${character.name} dodged for 1 shot.`)
      await addDodgeEffect(character)
      dispatch({ type: FightActions.EDIT })
    } catch(error) {
      toastError()
    }
  }

  const cheeseItAction = async (character: Character): Promise<void> => {
    try {
      // add pending action to character
      // await client.addPendingAction(character, fight, "cheesing it")
      await client.actCharacter(character, fight, 3)
      await FES.event(client, fight, character, `${character.name} is cheesing it!`, { shots: 3 })
      toastSuccess(`${character.name} is cheesing it!`)
      await addDodgeEffect(character)
      dispatch({ type: FightActions.EDIT })
    } catch(error) {
      console.error(error)
      toastError()
    }
  }

  const hideCharacter = async (character: Character | Vehicle): Promise<void> => {
    try {
      await client.hideCharacter(fight, character)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`${character.name} hidden.`)
    } catch(error) {
      toastError()
    }
  }

  const showCharacter = async (character: Character | Vehicle): Promise<void> => {
    try {
      await client.showCharacter(fight, character)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`${character.name} revealed.`)
    } catch(error) {
      toastError()
    }
  }

  const impairments = character.impairments ? `(-${character.impairments})` : ''
  const color = CS.isImpaired(character) ? 'error' : 'primary'
  const showDeathMarks = character.category === "character" &&
    (CS.isType(character, ["PC", "Ally"]) && character.action_values["Marks of Death"] as number > 0)

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
            <ActionButtonsWrapper
              first={first}
              character={character}
              takeAction={takeAction}
              takeWounds={takeWounds}
              healWounds={healWounds}
              takeDodgeAction={takeDodgeAction}
              cheeseItAction={cheeseItAction}
            />
            { first &&
              <Stack spacing={1}>
                <SchticksDisplay character={character} first={first} />
                <SkillsDisplay character={character} first={first} />
                <WeaponsDisplay character={character} first={first} />
              </Stack>
            }
            { !first &&
              <Stack direction="row" spacing={1} alignItems="center">
                <SchticksDisplay character={character} first={first} />
                <SkillsDisplay character={character} first={first} />
                <WeaponsDisplay character={character} first={first} />
              </Stack>
            }
          </GamemasterOnly>
          <DrivingDetails character={character} />
          <GroupedEffects character={character} />
        </Stack>
      </TableCell>
    </TableRow>
  )
}
