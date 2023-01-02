import { Typography, Link, IconButton, TableRow, TableCell } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Router from 'next/router'
import { useSession } from 'next-auth/react'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

export async function loadFight({ id, endpoint, jwt, setFight }: any) {
  console.log({ endpoint })
  const result = await fetch(`${endpoint}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  })
  if (result.status === 200) {
    const data = await result.json()
    console.log(data)
    setFight({shot_order: []})
    setFight(data)
  }
}

export default function Fight({ fight, endpoint }: any) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  async function deleteFight(fight: any) {
    const response = await fetch(`${endpoint}/${fight.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    if (response.status === 200) {
      Router.reload()
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
