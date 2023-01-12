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
import { useState } from "react"

import { loadFight } from '../FightDetail'

import type { Character, Vehicle, Fight, Toast, ID } from "../../types/types"
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
    <>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{width: 50}}>
                <AvatarBadge character={character} session={session} />
              </TableCell>
              <TableCell sx={{width: 200}}>
                <NameDisplay character={character} />
              </TableCell>
              <TableCell sx={{width: 70}}>
                <GamemasterOnly user={session?.data?.user} character={character}>
                  <Stack direction="column" sx={{width: 70}} alignItems="center">
                    <Typography variant="h3">{wounds}</Typography>
                    <Typography variant="h6" sx={{color: 'text.secondary', fontVariant: 'small-caps', textTransform: 'lowercase'}}>
                      { character.action_values["Type"] === "Mook" ? "Mooks" : "Chase" }
                    </Typography>
                  </Stack>
                </GamemasterOnly>
              </TableCell>
              <TableCell sx={{width: 200}}>
                <GamemasterOnly user={session?.data?.user} character={character}>
                  <VehicleActionValues character={character} />
                </GamemasterOnly>
              </TableCell>
              <TableCell sx={{width: 100}}>
                <GamemasterOnly user={session?.data?.user} character={character}>
                  <ActionButtons character={character}
                    takeWounds={takeWounds}
                    takeAction={takeAction}
                    editCharacter={editCharacter}
                    deleteCharacter={deleteCharacter}
                    setToast={setToast}
                  />
                </GamemasterOnly>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <VehicleWoundsModal open={openWounds} setOpen={setOpenWounds} fight={fight} character={character} setFight={setFight} setToast={setToast} />
      <VehicleActionModal open={openAction} setOpen={setOpenAction} fight={fight} character={character} setFight={setFight} setToast={setToast} />
    </>
  )
}
