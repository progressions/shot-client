import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Router from "next/router"
import Character from './Character'

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
          <Character fight={fight} char={character} />
        )
      })}
    </>
  )
}
