import { TableContainer, Table, TableBody, TableRow, TableCell, Stack, Box, Typography } from "@mui/material"
import AvatarBadge from "../character/AvatarBadge"
import { useSession } from "next-auth/react"
import Client from "../Client"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import GamemasterOnly from "../GamemasterOnly"
import VehicleActionValues from "./ActionValues"
import VehicleActionModal from "./ActionModal"
import VehicleWoundsModal from "./WoundsModal"
import ActionButtons from "../character/ActionButtons"
import NameDisplay from "../character/NameDisplay"
import WoundsDisplay from "../vehicles/WoundsDisplay"
import { useState } from "react"

import { loadFight } from '../fights/FightDetail'

import type { Character, Person, Vehicle, Fight, Toast, ID } from "../../types/types"
import { defaultVehicle } from "../../types/types"

interface VehicleDetailsParams {
  character: Vehicle,
  fight: Fight,
  setFight: React.Dispatch<React.SetStateAction<Fight>>
  editingCharacter: Vehicle,
  setEditingCharacter: React.Dispatch<React.SetStateAction<Vehicle>> | ((character: Vehicle | null) => void)
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function VehicleDetails({ character, fight, setFight, editingCharacter, setEditingCharacter, setToast }: VehicleDetailsParams) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const [open, setOpen] = useState<Vehicle>(defaultVehicle)
  const [openAction, setOpenAction] = useState(false)
  const [openWounds, setOpenWounds] = useState(false)

  function closeAction() {
    setOpenAction(false)
  }

  async function deleteCharacter(character: Character): Promise<void> {
    const response = await client.deleteVehicle(character as Vehicle, fight)
    if (response.status === 200) {
      setToast({ open: true, message: `Vehicle ${character.name} removed.`, severity: "success" })
      await loadFight({jwt, id: fight.id as string, setFight})
    }
  }

  function editCharacter(character: Character): void {
    setEditingCharacter(character as Vehicle)
  }

  function takeAction(character: Character): void {
    setOpenAction(true)
  }

  function takeWounds(character: Character): void {
    setOpenWounds(true)
  }

  const wounds = (character?.action_values["Chase Points"])

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
            setToast={setToast}
          />
          <GamemasterOnly user={session?.data?.user} character={character}>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <VehicleActionValues character={character} />
              <ActionButtons character={character}
                takeWounds={takeWounds}
                takeAction={takeAction}
                setToast={setToast}
              />
            </Stack>
          </GamemasterOnly>
        </Stack>
      <VehicleActionModal open={openAction} setOpen={setOpenAction} fight={fight} character={character} setFight={setFight} setToast={setToast} />
      <VehicleWoundsModal open={openWounds} setOpen={setOpenWounds} fight={fight} character={character as Vehicle} setFight={setFight} setToast={setToast} />
      </TableCell>
    </TableRow>
  )
}
