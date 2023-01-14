import { IconButton, Button, Box, Stack, TableContainer, Table } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CharacterDetails from '../characters/CharacterDetails'
import VehicleDetails from '../vehicles/VehicleDetails'
import ShotButton from "./ShotButton"
import EffectDetail from "../effects/EffectDetail"
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import EffectModal from "../effects/EffectModal"

import type { Vehicle, Character, Fight, Toast } from "../../types/types"

import { useFight } from "../../contexts/FightContext"
import { useState } from "react"

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
  const [fight, setFight] = useFight()

  if (!showHidden && (shot === null || shot === undefined)) {
    return null
  }

  const setEditingCharacterWithCurrentShot = (character: Character | null): void => {
    setEditingCharacter({...character, current_shot: shot} as any)
  }

  const effectsForShot = (fight: Fight, shot: number) => {
    return fight.effects.filter((effect) => {
      return shot > 0 && (
        (fight.sequence == effect.start_sequence && shot <= effect.start_shot) ||
          (fight.sequence == effect.end_sequence && shot > effect.end_shot)
      )
    })
  }

  const color = (shot <= 0) ? "#ccc" : ""
  return (
    <>
      <TableRow key={shot}>
        <TableCell rowSpan={characters.length + 1} sx={{width: 60, verticalAlign: "top"}}>
          <Stack spacing={0} alignItems="center">
            <ShotButton shot={shot} />
            {
              effectsForShot(fight, shot).map((effect) => <EffectDetail effect={effect} key={effect.id} />)
            }
            { shot > 0 && <IconButton onClick={() => { setOpen(false); setOpenEffectDialog(true) }}>
              <AddCircleOutlineOutlinedIcon />
            </IconButton> }
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
