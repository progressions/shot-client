import { Grid, Skeleton, Pagination, Button, Box, Stack, Typography } from "@mui/material"
import SchtickCard from "@/components/schticks/SchtickCard"
import { useCharacter, useClient, useToast } from "@/contexts"
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
import { Schtick } from "@/types/types"

interface SchticksProps {
}

export default function Schticks({}: SchticksProps) {
  const { character } = useCharacter()
  const [state, dispatch] = useReducer(schticksReducer, initialSchticksState)
  const { user, client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { loading, edited, category, path, name, schticks, meta, page } = state
  const router = useRouter()

  useEffect(() => {
    const reload = async () => {
      try {
        if (character?.id) {
          const data = await client.getCharacterSchticks(character, { page, category, path, name, character_id: character?.id as string })
          dispatch({ type: SchticksActions.SCHTICKS, payload: data })
        } else {
          const data = await client.getSchticks({ page, category, path, name, character_id: character?.id as string })
          dispatch({ type: SchticksActions.SCHTICKS, payload: data })
        }
      } catch (error) {
        console.error("Error fetching schticks:", error)
        toastError()
      }
    }

    if (user && edited) {
      reload()
    }
  }, [user, edited, page, category, path, name, character?.id])

  useEffect(() => {
    if (character?.id) return

    router.push(
      { pathname: router.pathname, query: { page: page } },
      undefined,
      { shallow: true }
    )
  }, [edited, page])

  const rowsOfData = rowMap<Schtick>(schticks, 2)

  const outputRows = rowsOfData.map((row: Schtick[], index: number) => (
    <Stack spacing={1} direction="row" key={`row_${index}`}>
      { row.map((schtick: Schtick) => (
        <SchtickCard key={`schtick_${schtick?.id}`} schtick={schtick} state={state} dispatch={dispatch as React.Dispatch<SchticksActionType>} />
      )) }
    </Stack>)
  )

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch({ type: SchticksActions.UPDATE, name: "page", value: value})

    if (character?.id) return

    router.push(
      { pathname: router.pathname, query: { page: value } },
      undefined,
      { shallow: true }
    )
  }

  if (!schticks.length) return (<></>)

  return (
    <>
      <ButtonBar sx={{height: 80}}>
        <FilterSchticks state={state} dispatch={dispatch} />
        <CreateSchtickButton state={state} dispatch={dispatch} />
      </ButtonBar>
      <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
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
      <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
      { character?.id && <SchtickSelector allSchticksState={state} dispatchAllSchticks={dispatch} /> }
    </>
  )
}
