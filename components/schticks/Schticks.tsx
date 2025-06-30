import { Grid, Skeleton, Pagination, Button, Box, Stack, Typography } from "@mui/material"
import Schtick from "@/components/schticks/Schtick"
import { useClient, useToast } from "@/contexts"
import { Subhead } from "@/components/StyledFields"
import { rowMap } from "@/utils/rowMap"
import { useRouter } from 'next/router'

import { ButtonBar } from "@/components/StyledFields"
import CreateSchtickButton from "@/components/schticks/CreateSchtickButton"
import FilterSchticks from "@/components/schticks/FilterSchticks"
import SchtickSelector from "@/components/schticks/SchtickSelector"
import { useReducer, useEffect, useState, useMemo } from "react"
import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"
import { initialSchticksState, schticksReducer, SchticksActions } from "@/reducers/schticksState"
import { QueryType, Schtick as SchtickType } from "@/types/types"

interface SchticksProps {
  state: SchticksStateType,
  dispatch: React.Dispatch<SchticksActionType>
  pagination: boolean
}

export default function Schticks({ state, dispatch, pagination }: SchticksProps) {
  const router = useRouter()
  const { user, client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { loading, edited, category, path, name, schticks, meta, page } = state

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(
      { pathname: router.pathname, query: { page: value } },
      undefined,
      { shallow: true }
    )
  }

  const rowsOfData = rowMap<SchtickType>(schticks, 2)

  const outputRows = rowsOfData.map((row: SchtickType[], index: number) => (
    <Stack spacing={1} direction="row" key={`row_${index}`}>
      { row.map((schtick: SchtickType) => (
        <Schtick key={`schtick_${schtick?.id}`} schtick={schtick} state={state} dispatch={dispatch as React.Dispatch<SchticksActionType>} />
      )) }
    </Stack>)
  )

  return (
    <>
      <ButtonBar sx={{height: 80}}>
        <FilterSchticks state={state} dispatch={dispatch} />
        <CreateSchtickButton state={state} dispatch={dispatch} />
      </ButtonBar>
      { schticks?.length === 0 && !loading && (
        <Typography variant="body1">
          No schticks.
        </Typography>
      )}
      { !!schticks?.length && pagination && <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" /> }
      <Stack sx={{my: 2}} spacing={1}>
        { loading && <>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rectangular" width="50%" height={220} sx={{borderRadius: 1}} />
            <Skeleton variant="rectangular" width="50%" height={220} sx={{borderRadius: 1}} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rectangular" width="50%" height={220} sx={{borderRadius: 1}} />
            <Skeleton variant="rectangular" width="50%" height={220} sx={{borderRadius: 1}} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rectangular" width="50%" height={220} sx={{borderRadius: 1}} />
            <Skeleton variant="rectangular" width="50%" height={220} sx={{borderRadius: 1}} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rectangular" width="50%" height={220} sx={{borderRadius: 1}} />
            <Skeleton variant="rectangular" width="50%" height={220} sx={{borderRadius: 1}} />
          </Stack>
        </> }
        { !loading && outputRows }
      </Stack>
      { !!schticks?.length && pagination && <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" /> }
    </>
  )
}
