import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"

import { useFight } from "../../contexts/FightContext"
import FightName from "../../components/fights/FightName"
import FightToolbar from '../../components/fights/FightToolbar'
import Shot from '../../components/shots/Shot'
import CharacterModal from '../../components/character/CharacterModal'
import VehicleModal from '../../components/vehicles/VehicleModal'
import Sequence from "../../components/Sequence"

import { defaultCharacter, ServerSideProps } from "../../types/types"

import type { Person, Vehicle, ShotType, Character, Fight } from "../../types/types"

import { useState } from "react"

export default function ShotCounter() {
  const [editingCharacter, setEditingCharacter] = useState<Person | Vehicle>(defaultCharacter)
  const [showHidden, setShowHidden] = useState<boolean>(false)
  const [fight, setFight] = useFight()

  return (
    <>
      <FightName />
      <FightToolbar showHidden={showHidden} setShowHidden={setShowHidden} />
      <TableContainer>
        <Table sx={{minWidth: 900, maxWidth: 1000}}>
          <TableHead>
            <TableRow>
              <TableCell colSpan={4}>
                <Sequence />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              fight.shot_order.map(([shot, chars]: ShotType) =>
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
      <CharacterModal open={editingCharacter}
        setOpen={setEditingCharacter}
        fight={fight}
        character={editingCharacter as Person}
        setFight={setFight}
      />
      <VehicleModal
        open={editingCharacter as Vehicle}
        setOpen={setEditingCharacter as React.Dispatch<React.SetStateAction<Vehicle>>}
        fight={fight}
        character={editingCharacter as Vehicle}
        setFight={setFight}
      />
    </>
  )
}
