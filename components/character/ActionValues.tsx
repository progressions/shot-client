import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import { Stack, Typography } from '@mui/material'
import { tableCellClasses } from "@mui/material/TableCell"

export default function ActionValues({ character }: any) {
  const color = character.impairments ? 'red' : ''
  const styles = {
    width: 60,
    borderColor: '#ccc',
    borderRight: 'none'
  }
  const ActionValueDisplay = ({ name, label, character, sx }) => {
    if (character.action_values[name]) {
      return (
        <Stack spacing={1} sx={sx || styles} border={1}>
          <Typography variant="body2" align='center'>{label}</Typography>
          <Typography variant="h6" align='center' sx={{color: color}}>{character.action_values[name] - (character.impairments || 0)}</Typography>
        </Stack>
      )
    }
  }
  return (
    <Stack direction="row" spacing={0}>
      <ActionValueDisplay label="Attack" name="Guns" character={character} />
      <ActionValueDisplay label="Defense" name="Defense" character={character} />
      { character.action_values["Type"] === "PC" &&
        <ActionValueDisplay label="Fortune" name="Fortune" character={character} /> }
      { character.action_values["Type"] !== "Mook" &&
        <ActionValueDisplay label="Tough" name="Toughness" character={character} /> }
      <ActionValueDisplay label="Speed" name="Speed" character={character} sx={{...styles, borderRightColor: "#ccc", borderRight: 1}} />
    </Stack>
  )
}
