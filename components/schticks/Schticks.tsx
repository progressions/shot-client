import { Button, Box, Stack, Typography } from "@mui/material"
import SchtickCard from "./SchtickCard"
import NewSchtick from "./NewSchtick"
import { useClient } from "../../contexts/ClientContext"

import { useState, useMemo } from "react"

function rowMap(array: any[]) {
  const rows = []
  for (let i=0; i <= array.length; i+=2) {
    const row = []
    row.push(array[i])
    if (i+1 < array.length) {
      row.push(array[i+1])
    }
    rows.push(row)
  }
  return rows
}

export default function Schticks({ filter, dispatchFilter }: any) {
  const { user, client } = useClient()

  const { schticks, meta } = filter?.data

  console.log(meta)

  const rowsOfData = useMemo(() => (
    rowMap(schticks)
  ), [schticks])

  const outputRows = useMemo(() => {
    const newSchtick = <NewSchtick />
    const output = (
      rowsOfData.map((row: any, index: number) => (
        <Stack spacing={1} direction="row" key={`row_${index}`}>
          { row.map((schtick: any) => (
            <SchtickCard key={`schtick_${schtick?.id}`} schtick={schtick} dispatchFilter={dispatchFilter} />
          )) }
        </Stack>
      ))
    )
    return output
  }, [dispatchFilter, rowsOfData])

  function loadPrevious() {
    dispatchFilter({ type: "previous" })
  }

  function loadNext() {
    dispatchFilter({ type: "next" })
  }

  if (!schticks) return (<></>)

  return (
    <>
      <Stack spacing={1}>
        { meta?.prev_page && <Box width="100%"><Button sx={{width: "100%"}} onClick={loadPrevious} variant="contained" color="primary">Previous</Button></Box> }
        { outputRows }
        { meta?.next_page && <Box width="100%"><Button sx={{width: "100%"}} onClick={loadNext} variant="contained" color="primary">Next</Button></Box> }
      </Stack>
    </>
  )
}
