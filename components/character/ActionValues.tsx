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
  return (
    <Stack direction="row" spacing={0}>
      <Stack spacing={1} sx={styles} border={1}>
        <Typography variant="body2" align='center'>Attack</Typography>
        <Typography variant="h6" align='center' sx={{color: color}}>{character.action_values["Guns"] - (character.impairments || 0)}</Typography>
      </Stack>
      <Stack spacing={1} sx={styles} border={1}>
        <Typography variant="body2" align='center'>Defense</Typography>
        <Typography variant="h6" align='center' sx={{color: color}}>{character.action_values["Defense"] - (character.impairments || 0)}</Typography>
      </Stack>
      { character.action_values["Type"] === "PC" &&
      <Stack spacing={1} sx={styles} border={1}>
        <Typography variant="body2" align='center'>Fortune</Typography>
        <Typography variant="h6" align='center' sx={{color: color}}>{character.action_values["Fortune"] - (character.impairments || 0)}</Typography>
      </Stack> }
      { character.action_values["Type"] !== "Mook" &&
      <Stack spacing={1} sx={styles} border={1}>
        <Typography variant="body2" align='center'>Tough</Typography>
        <Typography variant="h6" align='center' sx={{color: color}}>{character.action_values["Toughness"] - (character.impairments || 0)}</Typography>
      </Stack> }
      <Stack spacing={1} sx={{...styles, borderRightColor: '#ccc', borderRight: 1}} border={1}>
        <Typography variant="body2" align='center'>Speed</Typography>
        <Typography variant="h6" align='center' sx={{color: color}}>{character.action_values["Speed"] - (character.impairments || 0)}</Typography>
      </Stack>
    </Stack>
  )
}
