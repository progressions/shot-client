import { Pagination, Stack } from "@mui/material"
import type { Juncture as JunctureType } from "@/types/types"
import { JuncturesStateType, JuncturesActionType, JuncturesActions } from "@/reducers/juncturesState"
import Juncture from "@/components/junctures/Juncture"
import { Subhead } from "@/components/StyledFields"
import { useRouter } from "next/router"
import { useState } from "react"

interface JuncturesProps {
  state: JuncturesStateType,
  dispatch: React.Dispatch<JuncturesActionType>
  pagination: boolean
}

export default function Junctures({ state, dispatch, pagination }: JuncturesProps) {
  const router = useRouter()

  const { page, junctures, meta } = state

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
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
          junctures.map(juncture => (
            <Juncture key={juncture.id} juncture={juncture} state={state} dispatch={dispatch} />
          ))
        }
      </Stack>
      { pagination && <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" /> }
    </>
  )
}
