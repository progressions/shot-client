import { Tooltip, Stack, Typography, Link, IconButton, TableRow, TableCell } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'

import GamemasterOnly from "../GamemasterOnly"

import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import type { Fight, Toast } from "../../types/types"
import { defaultFight } from "../../types/types"
import type { FightsStateType, FightsActionType } from "./fightsState"
import { FightsActions } from "./fightsState"

interface FightParams {
  fight: Fight
  state: FightsStateType
  dispatch: React.Dispatch<FightsActionType>
}

export default function FightDetail({ fight, state, dispatch }: FightParams) {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  async function deleteFight(fight: Fight) {
    const doit = confirm(`Permanently delete ${fight.name}?`)
    if (!doit) return
    const response = await client.deleteFight(fight)
    if (response.status === 200) {
      toastError(`Fight ${fight.name} deleted`)
      dispatch({ type: FightsActions.EDIT })
    }
  }

  async function toggleVisibility(fight: Fight) {
    const response = await client.updateFight({ ...fight, "active": !fight.active })
    if (response.status === 200) {
      toastSuccess(`Fight ${fight.name} updated`)
      dispatch({ type: FightsActions.EDIT })
    }
  }

  return (
    <TableRow key={fight.id} >
      <TableCell>
        <Typography color="text.primary" variant="h6">
          <Link color="text.primary" href={`/fights/${fight.id}`}>
           {fight.name}
          </Link>
        </Typography>
      </TableCell>
      <TableCell>
        {fight.characters?.length}
      </TableCell>
      <TableCell>
        {fight.shot_order?.[0]?.[0] || ''}
      </TableCell>
      <TableCell>
        <GamemasterOnly user={user}>
          <Stack direction="row">
            <Tooltip title={fight.active? "Hide" : "Show"}>
              <IconButton color="primary" onClick={() => toggleVisibility(fight)}>
                { !fight.active ? <VisibilityOffIcon /> : <VisibilityIcon /> }
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={() => deleteFight(fight)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </GamemasterOnly>
      </TableCell>
    </TableRow>
  )
}
