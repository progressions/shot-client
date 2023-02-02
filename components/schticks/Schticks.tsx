import { Button, Box, Stack, Typography } from "@mui/material"
import SchtickCard from "./SchtickCard"
import { useClient } from "../../contexts/ClientContext"
import { Subhead } from "../StyledFields"
import { rowMap } from "../../utils/rowMap"

import { useState, useMemo } from "react"
import { SchticksStateType, SchticksActionType } from "./filterReducer"
import { Schtick } from "../../types/types"

interface SchticksProps {
  filter: SchticksStateType
  dispatchFilter?: React.Dispatch<SchticksActionType>
}

export default function Schticks({ filter, dispatchFilter }: SchticksProps) {
  const { user, client } = useClient()

  const schticks:Schtick[] = useMemo(() => (filter?.schticks || []), [filter?.schticks])
  const meta = filter?.meta || {}

  const rowsOfData = useMemo(() => (
    rowMap<Schtick>(schticks, 2)
  ), [schticks])

  const outputRows = useMemo(() => {
    const output = (
      rowsOfData.map((row: Schtick[], index: number) => (
        <Stack spacing={1} direction="row" key={`row_${index}`}>
          { row.map((schtick: Schtick) => (
            <SchtickCard key={`schtick_${schtick?.id}`} schtick={schtick} filter={filter} dispatchFilter={dispatchFilter} />
          )) }
        </Stack>
      ))
    )
    return output
  }, [filter, dispatchFilter, rowsOfData])

  function loadPrevious() {
    if (!dispatchFilter) return

    dispatchFilter({ type: "previous" })
  }

  function loadNext() {
    if (!dispatchFilter) return

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
