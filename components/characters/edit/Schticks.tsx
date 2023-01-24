import { Box, Stack, Typography } from "@mui/material"
import SchtickCard from "../schticks/SchtickCard"
import NewSchtick from "../schticks/NewSchtick"

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

  const rowsOfData = useMemo(() => (
    rowMap(schticks)
  ), [schticks])

  // Add the "New Schtick" card to the last entry in the list.
  // If there's an empty space in the last row, add it there.
  // If not, add a new row with the New Schtick card.
  //
  const outputRows = useMemo(() => {
    const output = (
      rowsOfData.map((row: any, index: number) => (
        <Stack spacing={1} direction="row" key={index}>
          { row.map((schtick: any) => (
            <SchtickCard key={schtick?.id} schtick={schtick} />
          )) }
          { index == rowsOfData.length-1 && schticks.length % 3 != 0 &&
          <NewSchtick dispatchCharacter={dispatch} /> }
        </Stack>
      ))
    )
    if (schticks.length % 3 === 0) {
      output.push(
        <Stack spacing={1} direction="row" key={schticks.length}>
          <NewSchtick dispatchCharacter={dispatch} />
        </Stack>
      )
    }
    return output
  }, [rowsOfData])

  if (!schticks) return (<></>)

  return (
    <>
      <Typography variant="h3">Schticks</Typography>
      { outputRows }
    </>
  )
}
