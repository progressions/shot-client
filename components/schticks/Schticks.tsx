import { Grid, Button, Box, Stack, Typography } from "@mui/material"
import SchtickCard from "@/components/schticks/SchtickCard"
import { useClient } from "@/contexts/ClientContext"
import { Subhead } from "@/components/StyledFields"
import { rowMap } from "@/utils/rowMap"

import { useState, useMemo } from "react"
import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"
import { SchticksActions } from "@/reducers/schticksState"
import { Schtick } from "@/types/types"

interface SchticksProps {
  state: SchticksStateType
  dispatch?: React.Dispatch<SchticksActionType>
}

export default function Schticks({ state, dispatch }: SchticksProps) {
  const { user, client } = useClient()
  const { loading, schticks, meta } = state

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

  if (!schticks) return (<></>)

  return (
    <>
      <Stack spacing={1}>
        { outputRows }
      </Stack>
    </>
  )
}
