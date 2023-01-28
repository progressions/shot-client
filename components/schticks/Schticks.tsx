import { Button, Box, Stack, Typography } from "@mui/material"
import SchtickCard from "./SchtickCard"
import NewSchtick from "./NewSchtick"
import { useClient } from "../../contexts/ClientContext"
import { Subhead } from "../StyledFields"

import { useState, useMemo } from "react"

function rowMap(array: any[], itemsPerRow: number) {
  const rows = []
  for (let i=0; i <= array.length; i+=itemsPerRow) {
    const row = []
    for (let j=0; j < itemsPerRow; j++) {
      if (i+j < array.length) {
        row.push(array[i+j])
      }
    }
    rows.push(row)
  }
  return rows
}

export default function Schticks({ filter, dispatchFilter }: any) {
  const { user, client } = useClient()

  const schticks = useMemo(() => (filter?.schticks || []), [filter?.schticks])
  const meta = filter?.meta || {}

  const rowsOfData = useMemo(() => (
    rowMap(schticks, 2)
  ), [schticks])

  const outputRows = useMemo(() => {
    const output = (
      rowsOfData.map((row: any, index: number) => (
        <Stack spacing={1} direction="row" key={`row_${index}`}>
          { row.map((schtick: any) => (
            <SchtickCard key={`schtick_${schtick?.id}`} schtick={schtick} filter={filter} dispatchFilter={dispatchFilter} />
          )) }
        </Stack>
      ))
    )
    return output
  }, [filter, dispatchFilter, rowsOfData])

  function loadPrevious() {
    dispatchFilter({ type: "previous" })
  }

  function loadNext() {
    dispatchFilter({ type: "next" })
  }

  if (!schticks) return (<></>)

  return (
    <>
      <Subhead>Schticks</Subhead>
      <Stack spacing={1}>
        { meta?.prev_page && <Box width="100%"><Button sx={{width: "100%"}} onClick={loadPrevious} variant="contained" color="primary">Previous</Button></Box> }
        { outputRows }
        { meta?.next_page && <Box width="100%"><Button sx={{width: "100%"}} onClick={loadNext} variant="contained" color="primary">Next</Button></Box> }
      </Stack>
    </>
  )
}
