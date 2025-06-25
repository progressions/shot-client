import { Skeleton, Typography, Pagination, Stack } from "@mui/material"
import type { Site as SiteType } from "@/types/types"
import { sitesReducer, initialSitesState, SitesActions } from '@/reducers/sitesState'
import Site from "@/components/sites/Site"
import { ButtonBar } from "@/components/StyledFields"
import FilterSites from "@/components/sites/FilterSites"

import { useClient, useToast } from "@/contexts"
import { useEffect, useReducer, useState } from "react"
import { useRouter } from 'next/router'

interface SitesProps {
}

export default function Sites({}: SitesProps) {
  const router = useRouter()
  const { client, user } = useClient()
  const { toastError, toastSuccess } = useToast()
  const [state, dispatch] = useReducer(sitesReducer, initialSitesState)
  const { edited, loading, page, meta, sites, faction, secret, search, site } = state

  useEffect(() => {
    const reload = async () => {
      try {
        const data = await client.getSites({ search: site?.name, faction_id: faction.id, secret, page })
        dispatch({ type: SitesActions.SITES, payload: data })
      } catch (error) {
        toastError()
      }
    }

    if (user && edited) {
      reload()
    }
  }, [edited, user, page, faction, secret, search, site])

  useEffect(() => {
    router.push(
      { pathname: router.pathname, query: { page: page } },
      undefined,
      { shallow: true }
    )
  }, [edited])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch({ type: SitesActions.UPDATE, name: "page", value: value})
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
