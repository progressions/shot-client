import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'

export default function Shot({ shot, characters }: any) {
  return (
    <>
      <TableRow key={shot}>
        <TableCell key={shot}>
          <Typography variant="h4">{shot || 0}</Typography>
        </TableCell>
      </TableRow>
      {characters.map((character: any) => {
        return (
          <TableRow
            key={character.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell>
              <Typography>
                {character.name}
              </Typography>
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
