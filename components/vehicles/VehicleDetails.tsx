import { TableContainer, Table, TableBody, TableRow, TableCell, Stack, Box, Typography } from "@mui/material"
import AvatarBadge from "../characters/AvatarBadge"
import Client from "../../utils/Client"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import GamemasterOnly from "../GamemasterOnly"
import VehicleActionValues from "./ActionValues"
import VehicleActionModal from "./ActionModal"
import ChasePointsModal from "./ChasePointsModal"
import ConditionPointsModal from "./ConditionPointsModal"
import ActionButtons from "../characters/ActionButtons"
import NameDisplay from "../characters/NameDisplay"
import WoundsDisplay from "../vehicles/WoundsDisplay"
import PositionDisplay from "./PositionDisplay"
import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"

import type { Character, Person, Vehicle, Fight, Toast, ID } from "../../types/types"
import { defaultVehicle } from "../../types/types"
import { FightActions } from "../../reducers/fightState"

interface VehicleDetailsParams {
  character: Vehicle,
  editingCharacter: Vehicle,
  setEditingCharacter: React.Dispatch<React.SetStateAction<Vehicle>> | ((character: Vehicle | null) => void)
}

export default function VehicleDetails({ character, editingCharacter, setEditingCharacter }: VehicleDetailsParams) {
  const { fight, dispatch:dispatchFight } = useFight()
  const { user, client } = useClient()

  const [open, setOpen] = useState<Vehicle>(defaultVehicle)
  const [openAction, setOpenAction] = useState(false)
  const [openChasePoints, setOpenChasePoints] = useState(false)
  const [openConditionPoints, setOpenConditionPoints] = useState(false)
  const { toastSuccess, toastError } = useToast()

  function closeAction() {
    setOpenAction(false)
  }

  async function deleteCharacter(character: Character): Promise<void> {
    try {
      await client.deleteVehicle(character as Vehicle, fight)
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${character.name} removed.`)
      return
    } catch(error) {
      toastError()
    }
  }

  function editCharacter(character: Character): void {
    setEditingCharacter(character as Vehicle)
  }

  function takeAction(character: Character): void {
    setOpenAction(true)
  }

  function takeChasePoints(character: Character): void {
    setOpenChasePoints(true)
  }

  function takeConditionPoints(character: Character): void {
    setOpenConditionPoints(true)
  }

  const wounds = (character?.action_values["Chase Points"])

  return (
    <TableRow key={character.id}>
      <TableCell sx={{width: 50, verticalAlign: "top"}}>
        <AvatarBadge character={character} user={user} />
      </TableCell>
      <TableCell sx={{width: 70, verticalAlign: "top"}}>
        <WoundsDisplay character={character} user={user} />
      </TableCell>
      <TableCell sx={{verticalAlign: "top"}}>
        <Stack spacing={2}>
          <NameDisplay character={character}
            editCharacter={editCharacter}
            deleteCharacter={deleteCharacter}
          />
          <PositionDisplay character={character} />
          <GamemasterOnly user={user} character={character}>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <VehicleActionValues character={character} />
              <ActionButtons character={character}
                takeWounds={takeChasePoints}
                takeConditionPoints={takeConditionPoints}
                takeAction={takeAction}
              />
            </Stack>
          </GamemasterOnly>
        </Stack>
        <VehicleActionModal
          open={openAction}
          setOpen={setOpenAction}
          character={character}
        />
        <ChasePointsModal open={openChasePoints}
          setOpen={setOpenChasePoints}
          character={character as Vehicle}
        />
        <ConditionPointsModal open={openConditionPoints}
          setOpen={setOpenConditionPoints}
          character={character as Vehicle}
        />
      </TableCell>
    </TableRow>
  )
}
