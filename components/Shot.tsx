import { Stack, TableContainer, Table } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CharacterDetails from './character/CharacterDetails'

export default function Shot({ fight, setFight, shot, characters, editingCharacter, setEditingCharacter, showHidden }: any) {
  const label = shot === null ? "-" : shot

  if (!showHidden && (shot === null || shot === undefined)) {
    return null
  }

  const setEditingCharacterWithCurrentShot = (value: any) => {
    setEditingCharacter({...value, current_shot: shot})
  }

  const color = (shot <= 0) ? "#ccc" : ""
  return (
    <>
      <TableRow key={shot} sx={{border: 0}}>
        <TableCell key={shot} sx={{border: 0, padding: 2, width: 50, verticalAlign: 'top'}}>
          <Typography variant="h2" sx={{marginTop: 2, color: color}}>{label}</Typography>
        </TableCell>
        <TableCell sx={{border: 0}}>
          <Stack spacing={2}>
            {
              characters.map((character: any) => {
                return <CharacterDetails key={character.id} fight={fight} character={character} setFight={setFight} editingCharacter={editingCharacter} setEditingCharacter={setEditingCharacterWithCurrentShot} />
              })
            }
          </Stack>
        </TableCell>
      </TableRow>
    </>
  )
}
