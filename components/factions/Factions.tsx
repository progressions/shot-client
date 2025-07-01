import { Pagination, Stack } from "@mui/material"
import type { Faction as FactionType } from "@/types/types"
import { FactionsStateType, FactionsActionType, FactionsActions } from "@/reducers/factionsState"
import Faction from "@/components/factions/Faction"
import { Subhead } from "@/components/StyledFields"
import { useRouter } from "next/router"
import { useState } from "react"

interface FactionsProps {
  state: FactionsStateType,
  dispatch: React.Dispatch<FactionsActionType>
  pagination: boolean
}

export default function Factions({ state, dispatch, pagination }: FactionsProps) {
  const router = useRouter()

  const { page, factions, meta } = state

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
          factions.map(faction => (
            <Faction key={faction.id} faction={faction} state={state} dispatch={dispatch} />
          ))
        }
      </Stack>
      { pagination && <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" /> }
    </>
  )
}

