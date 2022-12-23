import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'

export default function Shot({ shot, characters }: any) {
  return (
    <>
      <TableRow key={shot}>
        <TableCell key={shot}>
          <Typography variant="h3">{shot || 0}</Typography>
        </TableCell>
      </TableRow>
      {characters.map((character: any) => {
        return (
          <TableRow key={character.id}>
            <TableCell>
              {character.name}
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
