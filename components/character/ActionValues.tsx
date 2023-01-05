import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import { Box, Stack, Typography } from '@mui/material'
import { tableCellClasses } from "@mui/material/TableCell"

export default function ActionValues({ character }: any) {
  const borderColor = "#aaa"
  const color = character.impairments ? 'red' : borderColor
  const styles = {
    width: 60,
    borderColor: borderColor,
    borderRight: 'none'
  }
  const ActionValueDisplay = ({ name, label, character, sx }: any) => {
    if (character.action_values[name]) {
      return (
        <Stack spacing={1} sx={sx || styles} border={1}>
          <Typography variant="body2" color="white" align="center" component="div"><Box bgcolor={borderColor}>{label}</Box></Typography>
          <Typography variant="h6" align="center" sx={{color: color}}>{character.action_values[name] - (character.impairments || 0)}</Typography>
        </Stack>
      )
    } else {
      return <></>
    }
  }

  return (
    <Stack direction="row" spacing={0}>
      <ActionValueDisplay label="Attack" name="Guns" character={character} />
      <ActionValueDisplay label="Defense" name="Defense" character={character} />
      { character.action_values["Type"] !== "Mook" &&
        <ActionValueDisplay label="Tough" name="Toughness" character={character} /> }
      { ["PC", "Ally"].includes(character.action_values["Type"]) &&
        <ActionValueDisplay label="Fortune" name="Fortune" character={character} /> }
      <ActionValueDisplay label="Speed" name="Speed" character={character} />
      <Stack sx={{borderLeft: 1, borderLeftColor: borderColor}} />
    </Stack>
  )
}
