import { Box, Stack, Typography } from "@mui/material"
import SchtickCard from "../schticks/SchtickCard"

import { useMemo } from "react"

function rowMap(array, itemsPerRow) {
  const rows = []
  for (let i=0; i <= array.length; i+=3) {
    const row = []
    row.push(array[i])
    if (i+1 < array.length) {
      row.push(array[i+1])
    }
    if (i+2 < array.length) {
      row.push(array[i+2])
    }
    rows.push(row)
  }
  return rows
}

export default function Schticks({ schticks, dispatch }: any) {

  const rowsOfSchticks = useMemo(() => (
    rowMap(schticks)
  ), [schticks])

  if (!schticks) return (<></>)

  return (
    <>
      <Typography variant="h3">Schticks</Typography>
      { !schticks.length &&
      <Typography>You have no schticks.</Typography> }

      { !!schticks.length && rowsOfSchticks.map((row: any, index: number) => (
      <Stack spacing={1} direction="row" key={index}>
        {
          !!schticks.length && row.map((schtick: any) => (
            <SchtickCard key={schtick.id} schtick={schtick} />
          ))
        }
      </Stack>)) }
    </>
  )
}
