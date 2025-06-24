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
}

export default function Parties({ state, dispatch }: PartiesProps) {
  const router = useRouter()
  const { page:initialPage } = router.query
  const [page, setPage] = useState(initialPage ? parseInt(initialPage as string, 10) : 1)

  const { parties, meta } = state

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    dispatch({ type: PartiesActions.UPDATE, name: "page", value: value})
    router.push(
      { pathname: router.pathname, query: { page: value } },
      undefined,
      { shallow: true }
    )
  }

  return (
    <>
      <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
      <Stack spacing={2} sx={{ my: 2, width: "100%" }}>
        {
          parties.map(party => (
            <Party key={party.id} party={party} state={state} dispatch={dispatch} />
          ))
        }
      </Stack>
      <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
    </>
  )
}
