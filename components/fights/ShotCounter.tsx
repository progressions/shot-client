import { Box, colors, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"

import { useFight } from "@/contexts/FightContext"
import FightName from "@/components/fights/FightName"
import FightToolbar from '@/components/fights/FightToolbar'
import Shot from '@/components/shots/Shot'
import CharacterModal from '@/components/characters/CharacterModal'
import VehicleModal from '@/components/vehicles/VehicleModal'
import Sequence from "@/components/fights/Sequence"
import CS from "@/services/CharacterService"
import FS from "@/services/FightService"
import AttackModal from "@/components/attacks/AttackModal"
import ChaseModal from "@/components/chases/ChaseModal"

import { defaultCharacter, ServerSideProps } from "@/types/types"

import type { Person, Vehicle, ShotType, Character, Fight } from "@/types/types"

import { useMemo, useState } from "react"

export default function ShotCounter() {
  const [editingCharacter, setEditingCharacter] = useState<Person | Vehicle>(defaultCharacter)
  const [showHidden, setShowHidden] = useState<boolean>(false)
  const { state, fight } = useFight()

  return (
    <>
      <FightName />
      <FightToolbar showHidden={showHidden} setShowHidden={setShowHidden} />
      { state.attacking && <AttackModal /> }
      { state.chasing && <ChaseModal /> }
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={4}>
                <Sequence />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              fight.shot_order && fight.shot_order.map(([shot, chars]: ShotType) =>
                <Shot key={shot}
                  shot={shot}
                  characters={chars}
                  editingCharacter={editingCharacter}
                  setEditingCharacter={setEditingCharacter}
                  showHidden={showHidden}
                />)
            }
          </TableBody>
        </Table>
      </TableContainer>
      { CS.isCharacter(editingCharacter) && <CharacterModal
        character={editingCharacter as Person}
      /> }
      { CS.isVehicle(editingCharacter) && <VehicleModal
        character={editingCharacter as Vehicle}
      /> }
    </>
  )
}
