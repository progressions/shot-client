import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import { tableCellClasses } from "@mui/material/TableCell"

export default function ActionValues({ character }: any) {
  return (
    <TableContainer>
      <Table sx={{[`& .${tableCellClasses.root}`]: { padding: 0, paddingBottom: 1, borderBottom: "none" } }} border={0}>
        <TableHead>
          <TableRow>
            <TableCell>
              Attack
            </TableCell>
            <TableCell>
              Defense
            </TableCell>
            <TableCell>
              Fortune
            </TableCell>
            <TableCell>
              Toughness
            </TableCell>
            <TableCell>
              Speed
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              {character.action_values["Guns"]}
            </TableCell>
            <TableCell>
              {character.action_values["Defense"]}
            </TableCell>
            <TableCell>
              {character.action_values["Fortune"]}
            </TableCell>
            <TableCell>
              {character.action_values["Toughness"]}
            </TableCell>
            <TableCell>
              {character.action_values["Speed"]}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
