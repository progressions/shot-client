import { Box, Stack, Typography } from "@mui/material"
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

export default function Schticks({ schticks, dispatchFilter }: any) {
  const { user, client } = useClient()

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

  if (!schticks) return (<></>)

  return (
    <>
      <Stack spacing={1}>
        { outputRows }
      </Stack>
    </>
  )
}
