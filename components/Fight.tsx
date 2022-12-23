import { Link, Button, TableRow, TableCell } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Router from 'next/router'

export default function Fight({ fight, endpoint }: any) {
  async function deleteFight(fight: any) {
    const response = await fetch(`${endpoint}/${fight.id}`, {
      method: 'DELETE'
    })
    if (response.status === 200) {
      Router.reload()
    }
  }

  return (
    <TableRow
      key={fight.id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        <Link href={`/fights/${fight.id}`}>
         {fight.name}
        </Link>
      </TableCell>
      <TableCell>
        {fight.characters?.length}
      </TableCell>
      <TableCell>
        {fight.shot_order?.[0]?.[0] || ''}
      </TableCell>
      <TableCell component="th" scope="row">
        <Button onClick={() => deleteFight(fight)}>
          <DeleteIcon />
        </Button>
      </TableCell>
    </TableRow>
  )
}
