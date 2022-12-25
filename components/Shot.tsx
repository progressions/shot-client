import Stack from '@mui/material/Stack'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Router from "next/router"

function Character({ character }) {
  const defense = character.defense ? `(D${character.defense})` : ''
  const impairments = character.impairments ? `(-${character.impairments})` : ''
  return (
    <>
      <Stack spacing={1} direction="row">
        <Typography sx={{fontWeight: 'bold'}}>
          {character.name}
        </Typography>
        <Typography>
          {defense}
        </Typography>
        <Typography>
          {impairments}
        </Typography>
      </Stack>
    </>
  )
}

export default function Shot({ fight, endpoint, shot, characters }: any) {
  async function deleteCharacter(character: any) {
    const response = await fetch(`${endpoint}/${fight.id}/characters/${character.id}`, {
      method: 'DELETE'
    })
    if (response.status === 200) {
      Router.reload()
    }
  }

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
          <TableRow
            key={character.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell>
              <Character character={character} />
            </TableCell>
            <TableCell>
              <IconButton onClick={() => deleteCharacter(character)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
