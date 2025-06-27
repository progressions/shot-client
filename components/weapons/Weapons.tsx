import { Skeleton, Pagination, Button, Box, Stack } from "@mui/material"
import { Subhead } from "@/components/StyledFields"
import type { QueryType, Weapon as WeaponType } from "@/types/types"
import Weapon from "@/components/weapons/Weapon"
import { useClient, useToast, useCharacter } from "@/contexts"
import { rowMap } from "@/utils/rowMap"
import AddWeapon from "@/components/weapons/AddWeapon"
import { useRouter } from 'next/router'
import { useReducer, useEffect } from "react"

import { ButtonBar } from "@/components/StyledFields"
import FilterWeapons from "@/components/weapons/FilterWeapons"
import { WeaponsActions, initialWeaponsState, weaponsReducer } from "@/reducers/weaponsState"
import type { WeaponsStateType, WeaponsActionType } from "@/reducers/weaponsState"

interface WeaponsProps {
}

export default function Weapons({}: WeaponsProps) {
  const { character, state:characterState } = useCharacter()
  const { edited:characterEdited } = characterState

  const { user, client } = useClient()
  const [state, dispatch] = useReducer(weaponsReducer, initialWeaponsState)
  const { weapons, edited, meta, page, loading, juncture, category, name } = state
  const { toastSuccess, toastError } = useToast()

  const router = useRouter()
  const { query } = router
  const { page:initialPage } = query as QueryType
  const initialPageNum = initialPage ? parseInt(initialPage as string, 10) : 1

  useEffect(() => {
    if (character?.id) return

    if (page !== initialPageNum) {
      dispatch({ type: WeaponsActions.PAGE, name: "page", value: initialPageNum })
    }
  }, [page, initialPageNum])

  useEffect(() => {
    if (edited) return

    if (character?.id && page > meta.total_pages) {
      // dispatch({ type: WeaponsActions.PAGE, name: "page", value: 1})
      return
    }

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
        console.log("Fetching Weapons page ", page)
        if (character?.id) {
          const data = await client.getCharacterWeapons(character, { page, juncture, category, name })
          dispatch({ type: WeaponsActions.WEAPONS, payload: data })
        } else {
          const data = await client.getWeapons({ page, juncture, category, name, character_id: character?.id as string })
          dispatch({ type: WeaponsActions.WEAPONS, payload: data })
        }
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited && !character?.id && page === initialPageNum) {
      reload().catch(toastError)
    }
    if (user?.id && edited && character?.id) {
      reload().catch(toastError)
    }
    if (user?.id && character?.id && characterEdited) {
      reload().catch(toastError)
    }
  }, [user, edited, characterEdited, character, user, juncture, category, initialPage, page, name])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (character?.id) {
      dispatch({ type: WeaponsActions.PAGE, name: "page", value: value})
      return
    }

    router.push(
      { pathname: router.pathname, query: { page: value } },
      undefined,
      { shallow: true }
    )
  }

  const rowsOfData = rowMap<WeaponType>(weapons, 2)

  const outputRows = (
    rowsOfData.map((row: WeaponType[], index: number) => (
      <Stack spacing={1} direction="row" key={`row_${index}`}>
        { row.map((weapon: WeaponType, index: number) => (
          <Weapon
            key={`weapon_${weapon?.id}_${index}`}
            weapon={weapon}
            state={state}
            dispatch={dispatch}
          />
        )) }
      </Stack>
    ))
  )

  return (
    <>
      <Subhead>Weapons</Subhead>
    { !loading && <>
      <ButtonBar sx={{height: 80}}>
        <FilterWeapons state={state} dispatch={dispatch} />
      </ButtonBar>
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
    { character?.id && <AddWeapon /> }
    </>
  )
}
