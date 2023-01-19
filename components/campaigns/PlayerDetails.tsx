import { IconButton, TableRow, TableCell } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import DeleteIcon from '@mui/icons-material/Delete'

import type { Campaign, User } from "../../types/types"

interface PlayerDetailsProps {
  campaign: Campaign
  player: User
  reload: any
}

export default function PlayerDetails({ campaign, player, reload }: PlayerDetailsProps) {
  const { client } = useClient()
  const { setToast } = useToast()

  async function removePlayer(user: User, camp: Campaign) {
    const response = await client.removePlayer(user, camp)
    if (response.status === 200) {
      await reload(camp)

      setToast({ open: true, message: `${user.email} removed.`, severity: "success" })
    }
  }

  return (
    <TableRow key={player.id}>
      <TableCell>{player.email}</TableCell>
      <TableCell>{player.first_name}</TableCell>
      <TableCell>{player.last_name}</TableCell>
      <TableCell>
        <IconButton color="primary" onClick={async () => await removePlayer(player, campaign)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
