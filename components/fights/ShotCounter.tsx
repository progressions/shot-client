import { colors, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"

import { useFight } from "../../contexts/FightContext"
import FightName from "./FightName"
import FightToolbar from './FightToolbar'
import Shot from '../../components/shots/Shot'
import CharacterModal from '../../components/characters/CharacterModal'
import VehicleModal from '../../components/vehicles/VehicleModal'
import Sequence from "./Sequence"

import { defaultCharacter, ServerSideProps } from "../../types/types"

import type { Person, Vehicle, ShotType, Character, Fight } from "../../types/types"

import { useMemo, useState } from "react"

export default function ShotCounter() {
  const [editingCharacter, setEditingCharacter] = useState<Person | Vehicle>(defaultCharacter)
  const [showHidden, setShowHidden] = useState<boolean>(false)
  const { fight } = useFight()

  const toolbar = useMemo(() => {
    if (fight?.id) {
      return <FightToolbar showHidden={showHidden} setShowHidden={setShowHidden} />
    }
    return <></>
  }, [fight?.id, showHidden])

  return (
    <>
      <FightName />
      { toolbar }
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
        character={editingCharacter as Person}
      />
      <VehicleModal
        open={editingCharacter as Vehicle}
        setOpen={setEditingCharacter as React.Dispatch<React.SetStateAction<Vehicle>>}
        character={editingCharacter as Vehicle}
      />
    </>
  )
}
