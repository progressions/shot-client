import { Pagination, Stack } from "@mui/material"
import type { Site as SiteType } from "@/types/types"
import { SitesStateType, SitesActionType, SitesActions } from "@/reducers/sitesState"
import Site from "@/components/sites/Site"
import { Subhead } from "@/components/StyledFields"
import { useRouter } from "next/router"
import { useState } from "react"

interface SitesProps {
  state: SitesStateType,
  dispatch: React.Dispatch<SitesActionType>
  pagination: boolean
}

export default function Sites({ state, dispatch, pagination }: SitesProps) {
  const router = useRouter()

  const { page, sites, meta } = state

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log("handlePageChange", value)
    dispatch({ type: SitesActions.PAGE, name: "page", value: value})

    router.push(
      { pathname: router.pathname, query: { page: value } },
      undefined,
      { shallow: true }
    )
  }

  return (
    <>
      { pagination && <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" /> }
      <Stack spacing={2} sx={{ my: 2, width: "100%" }}>
        {
          sites.map(site => (
            <Site key={site.id} site={site} state={state} dispatch={dispatch} />
          ))
        }
      </Stack>
      { pagination && <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" /> }
    </>
  )
}

