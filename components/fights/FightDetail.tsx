import { Tooltip, Stack, Typography, Link, IconButton, TableRow, TableCell } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'

import Router from 'next/router'
import { useSession } from 'next-auth/react'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import Client from "../Client"
import GamemasterOnly from "../GamemasterOnly"

import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import type { Fight, Toast } from "../../types/types"
import { defaultFight } from "../../types/types"

interface FightParams {
  fight: Fight,
  setFights: React.Dispatch<React.SetStateAction<Fight[]>>
}

export default function FightDetail({ fight, setFights }: FightParams) {
  const { reloadFights } = useFight()
  const { user, client } = useClient()
  const { setToast } = useToast()

  async function deleteFight(fight: Fight) {
    const doit = confirm(`Permanently delete ${fight.name}?`)
    if (!doit) return
    const response = await client.deleteFight(fight)
    if (response.status === 200) {
      setToast({ open: true, message: `Fight ${fight.name} deleted`, severity: "error" })
      reloadFights({ setFights })
    }
  }

  async function toggleVisibility(fight: Fight) {
    const response = await client.updateFight({ ...fight, "active": !fight.active })
    if (response.status === 200) {
      setToast({ open: true, message: `Fight ${fight.name} updated`, severity: "success" })
      reloadFights({ setFights })
    }
  }

  return (
    <TableRow key={fight.id} >
      <TableCell>
        <Link href={`/fights/${fight.id}`}>
          <Typography>
           {fight.name}
          </Typography>
        </Link>
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
              <IconButton onClick={() => toggleVisibility(fight)}>
                { !fight.active ? <VisibilityOffIcon /> : <VisibilityIcon /> }
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => deleteFight(fight)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </GamemasterOnly>
      </TableCell>
    </TableRow>
  )
}
