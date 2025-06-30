import { Pagination, Stack } from "@mui/material"
import type { Party as PartyType } from "@/types/types"
import { PartiesStateType, PartiesActionType, PartiesActions } from "@/reducers/partiesState"
import Party from "@/components/parties/Party"
import { Subhead } from "@/components/StyledFields"
import { useRouter } from "next/router"
import { useState } from "react"

interface PartiesProps {
  state: PartiesStateType,
  dispatch: React.Dispatch<PartiesActionType>
  pagination: boolean
}

export default function Parties({ state, dispatch, pagination }: PartiesProps) {
  const router = useRouter()

  const { page, parties, meta } = state

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch({ type: PartiesActions.PAGE, payload: value})
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
          parties.map(party => (
            <Party key={party.id} party={party} state={state} dispatch={dispatch} />
          ))
        }
      </Stack>
      { pagination && <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" /> }
    </>
  )
}
