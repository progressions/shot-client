import { Typography, Skeleton, Pagination, Box, Stack } from "@mui/material"
import { Subhead } from "@/components/StyledFields"
import { useClient, useToast, useCharacter } from "@/contexts"
import { useReducer, useEffect } from "react"
import { CharacterActions } from "@/reducers/characterState"
import { rowMap } from "@/utils/rowMap"
import Schtick from "@/components/schticks/Schtick"
import SchtickSelector from "@/components/schticks/SchtickSelector"
import type { Schtick as SchtickType } from "@/types/types"

import { SchticksActions, initialSchticksState, schticksReducer } from "@/reducers/schticksState"
import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"

interface EditSchticksProps {
}

export default function EditSchticks({}: EditSchticksProps) {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const { state:characterState, dispatch:dispatchCharacter } = useCharacter()
  const { character, reload:characterReload } = characterState

  const [state, dispatch] = useReducer(schticksReducer, initialSchticksState)
  const { loading, edited, category, path, name, schticks, meta, page } = state

  console.log("EditSchticks", { characterReload, loading, schticks })

  async function reload() {
    try {
      console.log("Fetching Schticks page ", page)
      const data = await client.getCharacterSchticks(character, { page, category, path, name})
      dispatch({ type: SchticksActions.SCHTICKS, payload: data })
    } catch(error) {
      toastError()
    }
  }

  useEffect(() => {
    console.log("Reloading schticks first time")

    if (user?.id) {
      reload().catch(console.error)
    }
  }, [user])

  useEffect(() => {
    console.log("EditSchticks characterReload changed", characterReload)

    if (user?.id && characterReload) {
      console.log("Reloading schticks due to character reload")
      reload().catch(console.error)
    }
  }, [user, characterReload])

  useEffect(() => {
    console.log("EditSchticks edited changed", characterReload)

    if (user?.id && edited) {
      console.log("Reloading schticks due to schticks edited")
      reload().catch(console.error)
    }
  }, [user, edited])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch({ type: SchticksActions.PAGE, name: "page", value })
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
      <Subhead>Schticks</Subhead>

      { schticks?.length === 0 && !loading && (
        <Typography variant="body1">
          No schticks.
        </Typography>
      )}

      { !loading && !!schticks?.length && <>
        <Stack spacing={1}>
          <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
          { outputRows }
          <Pagination count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
        </Stack>
      </> }

      { loading && <>
        <Skeleton animation="wave" height={50} />
        <Skeleton animation="wave" height={50} />
        <Skeleton animation="wave" height={50} />
        <Skeleton animation="wave" height={50} />
        <Skeleton animation="wave" height={50} />
        <Skeleton animation="wave" height={50} />
      </>}
      { <SchtickSelector allSchticksState={state} dispatchAllSchticks={dispatch} /> }
    </>
  )
}

