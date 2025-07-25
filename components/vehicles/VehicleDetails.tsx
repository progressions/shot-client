import { TableContainer, Table, TableBody, TableRow, TableCell, Stack, Box, Typography } from "@mui/material"
import AvatarBadge from "@/components/characters/AvatarBadge"
import Client from "@/utils/Client"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import GamemasterOnly from "@/components/GamemasterOnly"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import VehicleActionValues from "@/components/vehicles/ActionValues"
import ChasePointsModal from "@/components/vehicles/ChasePointsModal"
import ConditionPointsModal from "@/components/vehicles/ConditionPointsModal"
import ActionButtons from "@/components/vehicles/ActionButtons"
import NameDisplay from "@/components/characters/NameDisplay"
import WoundsDisplay from "@/components/vehicles/WoundsDisplay"
import PositionDisplay from "@/components/vehicles/PositionDisplay"
import { useState } from "react"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"
import GroupedEffects from "@/components/character_effects/GroupedEffects"
import DriverDetails from "@/components/vehicles/DriverDetails"
import FES from "@/services/FightEventService"
import ActionButtonsWrapper from "@/components/vehicles/ActionButtonsWrapper"

import type { Character, Person, Vehicle, Fight, Toast, ID } from "@/types/types"
import { defaultVehicle } from "@/types/types"
import { FightActions } from "@/reducers/fightState"

interface VehicleDetailsParams {
  character: Vehicle,
  editingCharacter: Vehicle,
  setEditingCharacter: React.Dispatch<React.SetStateAction<Vehicle>> | ((character: Vehicle | null) => void)
  className?: string
  hidden?: boolean
  shot: number
}

export default function VehicleDetails({ character, editingCharacter, setEditingCharacter, className, shot, hidden }: VehicleDetailsParams) {
  const { fight, dispatch } = useFight()
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
    const doit = confirm(`Remove ${character.name} from the fight?`)
    if (doit) {
      try {
        await client.deleteVehicle(character as Vehicle, fight)
        dispatch({ type: FightActions.EDIT })
        await FES.removeVehicle(client, fight, character as Vehicle)
        toastSuccess(`${character.name} removed.`)
        return
      } catch(error) {
        toastError()
      }
    }
  }

  const hideCharacter = async (character: Character | Vehicle) => {
    try {
      await client.hideVehicle(fight, character as Vehicle)
      dispatch({ type: FightActions.EDIT })
    } catch(error) {
      toastError()
    }
  }

  const showCharacter = async (character: Character | Vehicle) => {
    try {
      await client.showVehicle(fight, character as Vehicle)
      dispatch({ type: FightActions.EDIT })
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
    <TableRow key={character.id} className={className}>
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
            hideCharacter={hideCharacter}
            showCharacter={showCharacter}
            hidden={hidden}
            shot={shot}
          />
          <GamemasterOnly user={user} character={character}>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <VehicleActionValues character={character} />
              <ActionButtonsWrapper character={character} />
            </Stack>
          </GamemasterOnly>
          <DriverDetails vehicle={character} />
          <PositionDisplay character={character} />
          <GroupedEffects character={character} />
        </Stack>
      </TableCell>
    </TableRow>
  )
}
