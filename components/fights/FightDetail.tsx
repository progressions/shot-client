import { Typography, Link, IconButton, TableRow, TableCell } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Router from 'next/router'
import { useSession } from 'next-auth/react'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import Client from "../Client"

import type { Fight, Toast } from "../../types/types"
import { defaultFight } from "../../types/types"

interface loadFightParams {
  id: string,
  jwt: string,
  setFight: React.Dispatch<React.SetStateAction<Fight>>
}

interface FightParams {
  fight: Fight,
  setFights: React.Dispatch<React.SetStateAction<Fight[]>>
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

interface loadFightsParams {
  jwt: string,
  setFights: React.Dispatch<React.SetStateAction<Fight[]>>
}

export async function loadFight({ id, jwt, setFight }: loadFightParams) {
  const client = new Client({ jwt })
  const response = await client.getFight({ id })
  if (response.status === 200) {
    const data = await response.json()
    setFight(defaultFight)
    setFight(data)
  }
}

export async function loadFights({jwt, setFights}: loadFightsParams) {
  const client = new Client({ jwt })
  const response = await client.getFights()
  if (response.status === 200) {
    const data = await response.json()
    setFights([])
    setFights(data)
  }
}

export default function FightDetail({ fight, setFights, setToast }: FightParams) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  async function deleteFight(fight: Fight) {
    const response = await client.deleteFight(fight)
    if (response.status === 200) {
      setToast({ open: true, message: `Fight ${fight.name} deleted`, severity: "error" })
      loadFights({ jwt, setFights })
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
        <IconButton onClick={() => deleteFight(fight)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
