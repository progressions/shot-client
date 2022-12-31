import { Stack, TableContainer, Table } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Router from "next/router"
import Character from './Character'
import { useState } from 'react'

export default function Shot({ fight, endpoint, shot, characters }: any) {
  return (
    <>
      <TableRow key={shot} sx={{border: 0}}>
        <TableCell key={shot} sx={{border: 0, padding: 2, width: 50, verticalAlign: 'top'}}>
          <Typography variant="h2">{shot || 0}</Typography>
        </TableCell>
        <TableCell sx={{border: 0}}>
          <Stack spacing={2}>
            {
              characters.map((character: any) => {
                return <Character key={character.id} endpoint={endpoint} fight={fight} character={character} />
              })
            }
          </Stack>
        </TableCell>
      </TableRow>
    </>
  )
}
