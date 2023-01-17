import { TableContainer, Table, TableBody, TableRow, TableCell, Stack, Box, Typography } from "@mui/material"
import AvatarBadge from "../characters/AvatarBadge"
import { useSession } from "next-auth/react"
import Client from "../Client"
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
import { useFight } from "../../contexts/FightContext"

import { loadFight } from '../fights/FightDetail'

import type { Character, Person, Vehicle, Fight, Toast, ID } from "../../types/types"
import { defaultVehicle } from "../../types/types"

interface VehicleDetailsParams {
  character: Vehicle,
  editingCharacter: Vehicle,
  setEditingCharacter: React.Dispatch<React.SetStateAction<Vehicle>> | ((character: Vehicle | null) => void)
}

export default function VehicleDetails({ character, editingCharacter, setEditingCharacter }: VehicleDetailsParams) {
  const [fight, setFight] = useFight()
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const [open, setOpen] = useState<Vehicle>(defaultVehicle)
  const [openAction, setOpenAction] = useState(false)
  const [openChasePoints, setOpenChasePoints] = useState(false)
  const [openConditionPoints, setOpenConditionPoints] = useState(false)
  const { setToast } = useToast()

  function closeAction() {
    setOpenAction(false)
  }

  async function deleteCharacter(character: Character): Promise<void> {
    const response = await client.deleteVehicle(character as Vehicle, fight)
    if (response.status === 200) {
      setToast({ open: true, message: `${character.name} removed.`, severity: "success" })
      await loadFight({jwt, id: fight.id as string, setFight})
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

  const nothing = ({ character: char }: any) => {
    const pursuer = char.action_values["Pursuer"]
    console.log("pursuer", pursuer)
    const spacing = (char.action_values["Position"] === "near") ? 0 : 2
    const firstColor = pursuer ? "pursuer is true" : "pursuer is false"
    const secondColor = !pursuer ? "pursuer is false" : "pursuer is true"
    console.log("pursuer", pursuer)

    console.log({ firstColor })
    console.log({ secondColor })
    return (
      <Stack direction="row" spacing={spacing}>
        <Box color="inherit">
          <FaCarSide size={20} />
        </Box>
        <ArrowForwardIcon />
        <Box color="inherit">
          <FaCarSide size={20} />
        </Box>
      </Stack>
    )
  }

  return (
    <TableRow key={character.id}>
      <TableCell sx={{width: 50, verticalAlign: "top"}}>
        <AvatarBadge character={character} session={session} />
      </TableCell>
      <TableCell sx={{width: 70, verticalAlign: "top"}}>
        <WoundsDisplay character={character} session={session} />
      </TableCell>
      <TableCell sx={{verticalAlign: "top"}}>
        <Stack spacing={2}>
          <NameDisplay character={character}
            editCharacter={editCharacter}
            deleteCharacter={deleteCharacter}
          />
          <PositionDisplay character={character} />
          <GamemasterOnly user={session?.data?.user} character={character}>
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
