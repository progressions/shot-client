import { Button, Box, Stack, Typography } from "@mui/material"
import SchtickCard from "./SchtickCard"
import { useClient } from "../../contexts/ClientContext"
import { Subhead } from "../StyledFields"
import { rowMap } from "../../utils/rowMap"

import { useState, useMemo } from "react"
import type { SchticksStateType, SchticksActionType } from "../../reducers/schticksState"
import { SchticksActions } from "../../reducers/schticksState"
import { Schtick } from "../../types/types"

interface SchticksProps {
  state: SchticksStateType
  dispatch?: React.Dispatch<SchticksActionType>
}

export default function Schticks({ state, dispatch }: SchticksProps) {
  const { user, client } = useClient()

  const schticks:Schtick[] = useMemo(() => (state?.schticks || []), [state?.schticks])
  const meta = state?.meta || {}

  const rowsOfData = useMemo(() => (
    rowMap<Schtick>(schticks, 2)
  ), [schticks])

  const outputRows = useMemo(() => {
    const output = (
      rowsOfData.map((row: Schtick[], index: number) => (
        <Stack spacing={1} direction="row" key={`row_${index}`}>
          { row.map((schtick: Schtick) => (
            <SchtickCard key={`schtick_${schtick?.id}`} schtick={schtick} state={state} dispatch={dispatch as React.Dispatch<SchticksActionType>} />
          )) }
        </Stack>
      ))
    )
    return output
  }, [state, dispatch, rowsOfData])

  function loadPrevious() {
    if (!dispatch) return

    dispatch({ type: SchticksActions.PREVIOUS })
  }

  function loadNext() {
    if (!dispatch) return

    dispatch({ type: SchticksActions.NEXT })
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
