import { Grid, Skeleton, Pagination, Button, Box, Stack, Typography } from "@mui/material"
import Schtick from "@/components/schticks/Schtick"
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
import { QueryType, Schtick as SchtickType } from "@/types/types"

interface SchticksProps {
}

export default function Schticks({}: SchticksProps) {
  const { character, state:characterState } = useCharacter()
  const { reload:characterReload } = characterState

  const { user, client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const [state, dispatch] = useReducer(schticksReducer, initialSchticksState)
  const { loading, edited, category, path, name, schticks, meta, page } = state
  const router = useRouter()

  const { query } = router
  const { page:initialPage } = query as QueryType
  const initialPageNum = initialPage ? parseInt(initialPage as string, 10) : 1

  useEffect(() => {
    if (character?.id) return

    if (page !== initialPageNum) {
      dispatch({ type: SchticksActions.PAGE, name: "page", value: initialPageNum })
    }
  }, [character, page, initialPageNum])

  useEffect(() => {
    if (edited) return
    if (!page) return
    if (character?.id) return

    if (page > meta.total_pages) {
      router.push(
        { pathname: router.pathname, query: { page: 1 } },
        undefined,
        { shallow: true }
      )
    }
  }, [edited, page, meta])

  useEffect(() => {
    async function reload() {
      try {
        console.log("Fetching Schticks page ", page)
        if (character?.id) {
          const data = await client.getCharacterSchticks(character, { page, category, path, name, character_id: character?.id as string })
          dispatch({ type: SchticksActions.SCHTICKS, payload: data })
        } else {
          const data = await client.getSchticks({ page, category, path, name })
          dispatch({ type: SchticksActions.SCHTICKS, payload: data })
        }
      } catch(error) {
        console.log("Error fetching schticks:", error)
        toastError()
      }
    }

    if (user?.id && edited && !character?.id && page === initialPageNum) {
      reload().catch(toastError)
    }
    if (user?.id && edited && character?.id) {
      reload().catch(toastError)
    }
    if (user?.id && character?.id && characterReload) {
      reload().catch(toastError)
    }
  }, [user, edited, initialPage, page, category, path, name, character, characterReload])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (character?.id) {
      dispatch({ type: SchticksActions.PAGE, name: "page", value: value})
      return
    }

    router.push(
      { pathname: router.pathname, query: { page: value } },
      undefined,
      { shallow: true }
    )
  }

  const rowsOfData = rowMap<Schtick>(schticks, 2)

  const outputRows = rowsOfData.map((row: Schtick[], index: number) => (
    <Stack spacing={1} direction="row" key={`row_${index}`}>
      { row.map((schtick: Schtick) => (
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
      { !!schticks?.length && <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" /> }
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
      { !!schticks?.length && <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" /> }
    </>
  )
}
