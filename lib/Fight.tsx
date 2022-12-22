import { Button, TableRow, TableCell } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function Fight({ fight }: any) {
  return (
    <TableRow
      key={fight.id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {fight.name}
      </TableCell>
      <TableCell component="th" scope="row">
        <Button onClick={() => deleteFight(fight)}>
          <DeleteIcon />
        </Button>
      </TableCell>
    </TableRow>
  )
}
