import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Router from "next/router"
import Character from './Character'

export default function Shot({ fight, endpoint, shot, characters }: any) {
  return (
    <>
      <TableRow key={shot}>
        <TableCell key={shot}>
          <Typography variant="h4">{shot || 0}</Typography>
        </TableCell>
        <TableCell />
      </TableRow>
      {characters.map((character: any) => {
        return (
          <Character key={character.id} endpoint={endpoint} fight={fight} char={character} />
        )
      })}
    </>
  )
}
