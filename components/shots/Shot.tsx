import { IconButton, Button, Box, Stack, TableContainer, Table } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CharacterDetails from '@/components/characters/CharacterDetails'
import VehicleDetails from '@/components/vehicles/VehicleDetails'
import ShotButton from "@/components/shots/ShotButton"
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import EffectModal from "@/components/effects/EffectModal"
import GroupedEffects from "@/components/effects/GroupedEffects"

import type { User, Vehicle, Character, Fight, Toast } from "@/types/types"

import { useFight } from "@/contexts/FightContext"
import { useClient } from "@/contexts/ClientContext"
import { useState } from "react"

import GamemasterOnly from "@/components/GamemasterOnly"

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
  const { fight } = useFight()
  const { user } = useClient()

  if (!showHidden && (shot === null || shot === undefined)) {
    return null
  }

  const setEditingCharacterWithCurrentShot = (character: Character | null): void => {
    if (!character) return
    setEditingCharacter({...character, current_shot: shot} as Character)
  }

  const color = (shot <= 0) ? "#ccc" : ""
  const className = (shot === null) ? "hidden" : ""
  const hidden = (shot === null) ? true : false

  if (hidden && !user.gamemaster) return null
  return (
    <>
      <TableRow key={shot} className={className}>
        <TableCell rowSpan={characters.length + 1} sx={{width: 60, verticalAlign: "top"}}>
          <Stack spacing={0} alignItems="center">
            <ShotButton shot={shot} />
            <GroupedEffects key={`effects_${shot}`} fight={fight} shot={shot} />
            <GamemasterOnly user={user}>
              { shot > 0 && <IconButton color="primary" onClick={() => { setOpen(false); setOpenEffectDialog(true) }}>
                <AddCircleOutlineOutlinedIcon />
              </IconButton> }
            </GamemasterOnly>
            <EffectModal shot={shot} open={openEffectDialog} setOpen={setOpenEffectDialog} />
          </Stack>
        </TableCell>
      </TableRow>
      {characters.map((character: Character, index: number) => {
        if (character.category === "character") {
          return (
            <CharacterDetails
              key={`${character.id}-${index}`}
              character={character}
              editingCharacter={editingCharacter as Character}
              setEditingCharacter={setEditingCharacterWithCurrentShot}
              className={className}
              hidden={hidden}
              shot={shot}
            />
          )
        }
        if (character.category === "vehicle") {
          return (
            <VehicleDetails
              key={`${character.id}-${index}`}
              character={character as Vehicle}
              editingCharacter={editingCharacter as Vehicle}
              setEditingCharacter={setEditingCharacterWithCurrentShot}
              className={className}
              hidden={hidden}
              shot={shot}
            />
          )
        }
      })}
    </>
  )
}
