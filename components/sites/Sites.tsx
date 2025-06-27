import { Skeleton, Typography, Pagination, Stack } from "@mui/material"
import type { QueryType, Site as SiteType } from "@/types/types"
import { sitesReducer, initialSitesState, SitesActions } from '@/reducers/sitesState'
import Site from "@/components/sites/Site"
import { ButtonBar } from "@/components/StyledFields"
import FilterSites from "@/components/sites/FilterSites"

import { useClient, useToast, useCharacter } from "@/contexts"
import { useEffect, useReducer, useState } from "react"
import { useRouter } from 'next/router'
import type { SitesStateType, SitesActionType } from "@/reducers/sitesState"

interface SitesProps {
}

export default function Sites({}: SitesProps) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(sitesReducer, initialSitesState)
  const { edited, loading, page, meta, sites, faction, secret, search, site } = state
  const { toastSuccess, toastError } = useToast()

  const router = useRouter()
  const { query } = router
  const { page:initialPage } = query as QueryType
  const initialPageNum = initialPage ? parseInt(initialPage as string, 10) : 1

  useEffect(() => {
    if (page !== initialPageNum) {
      dispatch({ type: SitesActions.PAGE, name: "page", value: initialPageNum })
    }
  }, [page, initialPageNum])

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
        console.log("Fetching Sites page ", page)
        const data = await client.getSites({ search: site?.name, faction_id: faction.id, secret, page })
        dispatch({ type: SitesActions.SITES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited && page === initialPageNum) {
      reload().catch(toastError)
    }
    if (user?.id && edited && character?.id) {
      reload().catch(toastError)
    }
  }, [user, initialPage, page, edited, faction, secret])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(
      { pathname: router.pathname, query: { page: value } },
      undefined,
      { shallow: true }
    )
  }

  if (!sites) return <></>

  return (
    <>
      <ButtonBar sx={{height: 80}}>
        <FilterSites state={state} dispatch={dispatch} />
      </ButtonBar>
      <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
      <Stack spacing={2} sx={{ my: 1, width: "100%" }}>
        { loading && <>
          <Skeleton variant="rectangular" width="100%" height={220} sx={{borderRadius: 1}} />
          <Skeleton variant="rectangular" width="100%" height={220} sx={{borderRadius: 1}} />
          <Skeleton variant="rectangular" width="100%" height={220} sx={{borderRadius: 1}} />
          <Skeleton variant="rectangular" width="100%" height={220} sx={{borderRadius: 1}} />
        </> }
        {
          !loading && sites.map(site => (
            <Site key={site.id} site={site} state={state} dispatch={dispatch} />
          ))
        }
      </Stack>
      <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
    </>
  )
}
