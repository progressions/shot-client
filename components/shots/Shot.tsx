import { IconButton, Button, Box, Stack, TableContainer, Table } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CharacterDetails from '../characters/CharacterDetails'
import VehicleDetails from '../vehicles/VehicleDetails'
import ShotButton from "./ShotButton"
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import EffectModal from "../effects/EffectModal"
import GroupedEffects from "../effects/GroupedEffects"

import type { Vehicle, Character, Fight, Toast } from "../../types/types"

import { useSession } from 'next-auth/react'
import { useFight } from "../../contexts/FightContext"
import { useState } from "react"

import GamemasterOnly from "../GamemasterOnly"

interface ShotParams {
  shot: number
  characters: Character[]
  editingCharacter: Character
  setEditingCharacter: React.Dispatch<React.SetStateAction<Character>>
  showHidden: boolean
}

export default function Shot({ shot, characters, editingCharacter, setEditingCharacter, showHidden }: ShotParams) {
  const [open, setOpen] = useState<boolean>(false)
  const [openEffectDialog, setOpenEffectDialog] = useState<boolean>(false)
  const { fight, setFight } = useFight()
  const session: any = useSession({ required: true })

  if (!showHidden && (shot === null || shot === undefined)) {
    return null
  }

  const setEditingCharacterWithCurrentShot = (character: Character | null): void => {
    if (!character) return
    setEditingCharacter({...character, current_shot: shot} as Character)
  }

  const color = (shot <= 0) ? "#ccc" : ""
  return (
    <>
      <TableRow key={shot}>
        <TableCell rowSpan={characters.length + 1} sx={{width: 60, verticalAlign: "top"}}>
          <Stack spacing={0} alignItems="center">
            <ShotButton shot={shot} />
            <GroupedEffects key={`effects_${shot}`} fight={fight} shot={shot} />
            <GamemasterOnly user={session?.data?.user}>
              { shot > 0 && <IconButton color="primary" onClick={() => { setOpen(false); setOpenEffectDialog(true) }}>
                <AddCircleOutlineOutlinedIcon />
              </IconButton> }
            </GamemasterOnly>
            <EffectModal shot={shot} open={openEffectDialog} setOpen={setOpenEffectDialog} />
          </Stack>
        </TableCell>
      </TableRow>
      {characters.map((character: Character) => {
        if (character.category === "character") {
          return <CharacterDetails key={character.id} character={character} editingCharacter={editingCharacter as Character} setEditingCharacter={setEditingCharacterWithCurrentShot} />
        }
        if (character.category === "vehicle") {
          return <VehicleDetails key={character.id} character={character as Vehicle} editingCharacter={editingCharacter as Vehicle} setEditingCharacter={setEditingCharacterWithCurrentShot} />
        }
      })}
    </>
  )
}
